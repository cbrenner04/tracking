const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: 'users_username_unique_constraint',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeSave: (user) => {
        console.log('BEFORE SAVE')
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
  });
  user.associate = function (models) {
    user.hasMany(models.Drink, {
      foreignKey: 'user_id'
    });
  };
  user.prototype.validPassword = function (suppliedPassword) {
    return bcrypt.compareSync(suppliedPassword, this.password);
  }
  return user;
};
