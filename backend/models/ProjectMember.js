const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define('ProjectMember', {
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM('Owner', 'Collaborator', 'Viewer'),
    defaultValue: 'Collaborator',
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'userId']
    }
  ]
});

module.exports = ProjectMember;
