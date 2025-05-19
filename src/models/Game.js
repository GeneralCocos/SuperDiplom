const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    whitePlayerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    blackPlayerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    gameType: {
      type: DataTypes.ENUM('chess', 'go', 'checkers'),
      defaultValue: 'chess'
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active'
    },
    result: {
      type: DataTypes.ENUM('white_win', 'black_win', 'draw', 'ongoing'),
      defaultValue: 'ongoing'
    },
    pgn: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    timeControl: {
      type: DataTypes.JSON,
      defaultValue: {
        initial: 600,  // 10 minutes
        increment: 5   // 5 seconds
      }
    },
    moves: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE
    },
    isAIGame: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    aiDifficulty: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Game.associate = (models) => {
    Game.belongsTo(models.User, { as: 'whitePlayer', foreignKey: 'whitePlayerId' });
    Game.belongsTo(models.User, { as: 'blackPlayer', foreignKey: 'blackPlayerId' });
    Game.hasMany(models.GameChat, { foreignKey: 'gameId' });
  };

  return Game;
}; 