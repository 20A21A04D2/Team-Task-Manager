const { ActivityLog, Notification } = require('../models');

const logActivity = async ({ action, details, userId, projectId = null, taskId = null }) => {
  try {
    await ActivityLog.create({
      action,
      details,
      userId,
      projectId,
      taskId
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

const createNotification = async ({ message, userId }) => {
  try {
    await Notification.create({
      message,
      userId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  logActivity,
  createNotification
};
