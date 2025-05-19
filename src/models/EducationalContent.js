const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EducationalContent = sequelize.define('EducationalContent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('tutorial', 'lesson', 'puzzle', 'article'),
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false
    },
    gameType: {
      type: DataTypes.ENUM('chess', 'go', 'checkers'),
      defaultValue: 'chess'
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'FEN notation for chess positions'
    },
    solution: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    authorId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    publishedAt: {
      type: DataTypes.DATE
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  });

  EducationalContent.associate = (models) => {
    EducationalContent.belongsTo(models.User, { as: 'author', foreignKey: 'authorId' });
    EducationalContent.hasMany(models.Progress, { foreignKey: 'contentId' });
    EducationalContent.hasMany(models.Comment, { foreignKey: 'contentId' });
  };

  return EducationalContent;
}; 