module.exports = function(sequelize, DataTypes) {
  var Laptop = sequelize.define("Laptop", {
    sn: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [20]
      }
    },
    assigned: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    },
    powerAdapterSN: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    assignedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [20]
    }
  });


  return Laptop;
};
