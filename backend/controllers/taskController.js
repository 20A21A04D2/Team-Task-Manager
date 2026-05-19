const { Task, Project, User, Comment } = require('../models');
const { logActivity, createNotification } = require('../utils/activity');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      projectId,
      assigneeId: assigneeId || null
    });

    // Log Activity
    await logActivity({
      action: 'CREATE_TASK',
      details: `Task "${title}" was created in project "${project.name}".`,
      userId: req.user.id,
      projectId,
      taskId: task.id
    });

    // Notify Assignee
    if (assigneeId) {
      await createNotification({
        message: `You have been assigned to task "${title}" in project "${project.name}"`,
        userId: assigneeId
      });
    }

    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({
      success: true,
      task: fullTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { projectId, assigneeId, status, search, priority } = req.query;
    const filter = {};

    if (projectId) filter.projectId = projectId;
    if (assigneeId) filter.assigneeId = assigneeId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.title = {
        [Task.sequelize.Sequelize.Op.like]: `%${search}%`
      };
    }

    const tasks = await Task.findAll({
      where: filter,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project', attributes: ['name'] }]
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, status, priority, dueDate, assigneeId } = req.body;
    const oldStatus = task.status;
    const oldAssignee = task.assigneeId;

    await task.update({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      assigneeId: assigneeId === '' ? null : assigneeId
    });

    // Log Activity & Create Notification if Status changed
    if (oldStatus !== status) {
      await logActivity({
        action: 'UPDATE_TASK_STATUS',
        details: `Task status changed from "${oldStatus}" to "${status}".`,
        userId: req.user.id,
        projectId: task.projectId,
        taskId: task.id
      });

      if (task.assigneeId && task.assigneeId !== req.user.id) {
        await createNotification({
          message: `Task "${task.title}" status was updated to "${status}"`,
          userId: task.assigneeId
        });
      }
    }

    // Notify new assignee if changed
    if (assigneeId && oldAssignee !== assigneeId) {
      await logActivity({
        action: 'ASSIGN_TASK',
        details: `Task was assigned to another team member.`,
        userId: req.user.id,
        projectId: task.projectId,
        taskId: task.id
      });

      await createNotification({
        message: `You have been assigned to task "${task.title}"`,
        userId: assigneeId
      });
    }

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await logActivity({
      action: 'DELETE_TASK',
      details: `Task "${task.title}" was deleted.`,
      userId: req.user.id,
      projectId: task.projectId,
      taskId: task.id
    });

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addTaskComment = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { content } = req.body;

    const comment = await Comment.create({
      content,
      taskId: task.id,
      userId: req.user.id
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    await logActivity({
      action: 'ADD_COMMENT',
      details: `Added a comment on task "${task.title}".`,
      userId: req.user.id,
      projectId: task.projectId,
      taskId: task.id
    });

    res.status(201).json({
      success: true,
      comment: fullComment
    });
  } catch (error) {
    next(error);
  }
};
