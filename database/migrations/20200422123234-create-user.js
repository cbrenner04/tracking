module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });

    await queryInterface.addConstraint('users', ['username'], {
      type: 'unique',
      name: 'users_username_unique_constraint',
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  }
};
