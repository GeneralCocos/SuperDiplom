const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Progress = sequelize.define('Progress', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    contentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'EducationalContents',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
      defaultValue: 'not_started'
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastAttemptAt: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Time spent in seconds'
    },
    notes: {
      type: DataTypes.TEXT
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  });

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, { foreignKey: 'userId' });
    Progress.belongsTo(models.EducationalContent, { foreignKey: 'contentId' });
  };

  return Progress;
}; 