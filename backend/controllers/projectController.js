const { Project, User, Task, ProjectMember } = require('../models');
const { logActivity, createNotification } = require('../utils/activity');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.create({
      name,
      description,
      status: status || 'Planning',
      ownerId: req.user.id
    });

    // Add owner to members table
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id,
      role: 'Owner'
    });

    // Log Activity
    await logActivity({
      action: 'CREATE_PROJECT',
      details: `Project "${name}" was created.`,
      userId: req.user.id,
      projectId: project.id
    });

    const fullProject = await Project.findByPk(project.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({
      success: true,
      project: fullProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    // Admins see all projects. Members see projects they own or belong to
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: Task, as: 'tasks' }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      projects = await Project.findAll({
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: Task, as: 'tasks' },
          {
            model: User,
            as: 'members',
            where: { id: req.user.id },
            attributes: [],
            required: false // Also include if owned but not in ProjectMembers yet
          }
        ],
        where: {
          [Project.sequelize.Sequelize.Op.or]: [
            { ownerId: req.user.id },
            { '$members.id$': req.user.id }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { 
          model: Task, as: 'tasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email'],
          through: { attributes: ['role'] }
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check ownership or admin
    if (project.ownerId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const { name, description, status } = req.body;
    
    await project.update({ name, description, status });

    await logActivity({
      action: 'UPDATE_PROJECT',
      details: `Project properties updated.`,
      userId: req.user.id,
      projectId: project.id
    });

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { 
          model: Task, as: 'tasks',
          include: [{ model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    res.status(200).json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await logActivity({
      action: 'DELETE_PROJECT',
      details: `Project "${project.name}" was deleted.`,
      userId: req.user.id,
      projectId: project.id
    });

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only owner or admin can add members
    if (project.ownerId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to invite members' });
    }

    const { email, role } = req.body;
    const targetUser = await User.findOne({ where: { email } });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      where: { projectId: project.id, userId: targetUser.id }
    });

    if (existingMember) {
      return res.status(400).json({ success: false, message: 'User is already a project member' });
    }

    await ProjectMember.create({
      projectId: project.id,
      userId: targetUser.id,
      role: role || 'Collaborator'
    });

    // Notify user
    await createNotification({
      message: `You have been added to project "${project.name}"`,
      userId: targetUser.id
    });

    // Log Activity
    await logActivity({
      action: 'ADD_MEMBER',
      details: `User ${targetUser.name} added as project member.`,
      userId: req.user.id,
      projectId: project.id
    });

    res.status(200).json({
      success: true,
      message: 'Member added successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members' });
    }

    const member = await ProjectMember.findOne({
      where: { projectId: project.id, userId: req.params.userId }
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member relationship not found' });
    }

    // Prevent removing owner
    if (member.role === 'Owner' || project.ownerId === req.params.userId) {
      return res.status(400).json({ success: false, message: 'Cannot remove project owner' });
    }

    await member.destroy();

    // Log Activity
    await logActivity({
      action: 'REMOVE_MEMBER',
      details: `Member removed from project.`,
      userId: req.user.id,
      projectId: project.id
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
