module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define("Student", {
    netId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [20]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    preferredName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    }
  });


  return Student;
};
