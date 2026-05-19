const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');
const Comment = require('./Comment');
const Notification = require('./Notification');
const ActivityLog = require('./ActivityLog');

// User <-> Project (Owner relationship)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User <-> Project (Many-to-Many via ProjectMember)
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'memberProjects' });
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });

// ProjectMember direct associations for query mapping
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'projectMemberships', onDelete: 'CASCADE' });
User.hasMany(ProjectMember, { foreignKey: 'userId', as: 'userMemberships', onDelete: 'CASCADE' });

// Project <-> Task
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User <-> Task (Assignee relationship)
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

// Task <-> Comment
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Notification (Recipient)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> ActivityLog (Actor)
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities', onDelete: 'SET NULL' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Project <-> ActivityLog
Project.hasMany(ActivityLog, { foreignKey: 'projectId', as: 'activities', onDelete: 'CASCADE' });
ActivityLog.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Task <-> ActivityLog
Task.hasMany(ActivityLog, { foreignKey: 'taskId', as: 'activities', onDelete: 'CASCADE' });
ActivityLog.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

module.exports = {
  User,
  Project,
  Task,
  ProjectMember,
  Comment,
  Notification,
  ActivityLog
};
