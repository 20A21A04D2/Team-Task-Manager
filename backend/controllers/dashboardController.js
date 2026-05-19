const { Task, Project, User, ActivityLog } = require('../models');
const { Op } = require('sequelize');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.count();
    const totalTasks = await Task.count();
    
    const completedTasks = await Task.count({ where: { status: 'Completed' } });
    const inProgressTasks = await Task.count({ where: { status: 'In Progress' } });
    const reviewTasks = await Task.count({ where: { status: 'Review' } });
    const toDoTasks = await Task.count({ where: { status: 'Todo' } });
    const pendingTasks = toDoTasks + inProgressTasks + reviewTasks;

    const highPriorityTasks = await Task.count({ where: { priority: 'High' } });
    const criticalPriorityTasks = await Task.count({ where: { priority: 'Critical' } });
    const mediumPriorityTasks = await Task.count({ where: { priority: 'Medium' } });
    const lowPriorityTasks = await Task.count({ where: { priority: 'Low' } });

    // Overdue tasks: dueDate < now, and status is NOT Completed
    const overdueTasks = await Task.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'Completed' }
      }
    });

    // Recent 5 tasks
    const recentTasks = await Task.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: Project, as: 'project', attributes: ['id', 'name'] }
      ]
    });

    // Project progress calculations
    const projects = await Project.findAll({
      include: [{ model: Task, as: 'tasks' }]
    });

    const projectProgress = projects.map(project => {
      const total = project.tasks.length;
      const completed = project.tasks.filter(t => t.status === 'Completed').length;
      const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
      return {
        id: project.id,
        name: project.name,
        totalTasks: total,
        completedTasks: completed,
        progress: percentage,
        status: project.status
      };
    });

    // Weekly performance: compile simulated weekly metrics based on actual DB status counts
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const performance = daysOfWeek.map((day, index) => {
      // Mock data populated dynamically, with spikes corresponding to total completed tasks
      const baseCompletion = Math.floor(completedTasks / 7) || 0;
      const remainder = completedTasks % 7;
      return {
        day,
        completed: index === 4 ? baseCompletion + remainder : baseCompletion
      };
    });

    // Activity logs: fetch recent 10 logs
    const activityTimeline = await ActivityLog.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });

    // Team productivity: counts of tasks grouped by assignee
    const assignees = await User.findAll({
      attributes: ['id', 'name'],
      include: [{ model: Task, as: 'assignedTasks', attributes: ['id', 'status'] }]
    });

    const teamProductivity = assignees.map(user => {
      const totalAssigned = user.assignedTasks.length;
      const completed = user.assignedTasks.filter(t => t.status === 'Completed').length;
      return {
        userId: user.id,
        name: user.name,
        totalTasks: totalAssigned,
        completedTasks: completed,
        efficiency: totalAssigned === 0 ? 0 : Math.round((completed / totalAssigned) * 100)
      };
    }).filter(t => t.totalTasks > 0);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        inProgressTasks,
        reviewTasks,
        toDoTasks,
        highPriorityTasks,
        criticalPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
      },
      recentTasks,
      projectProgress,
      performance,
      activityTimeline,
      teamProductivity
    });
  } catch (error) {
    next(error);
  }
};
