'use strict';
module.exports = (sequelize, DataTypes) => {
  const drink = sequelize.define('drink', {
    alcohol_content: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {});
  drink.associate = function(models) {
    drink.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return drink;
};
