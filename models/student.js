module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define("Student", {
    netId: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    preferredName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    
    laptopSN: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    powerAdapterSN: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    dukeEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [50]
    },
    altEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [50]
    },
    programYear: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [15]
    }
  });


  return Student;
};
