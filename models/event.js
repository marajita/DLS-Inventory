module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    sn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    netId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [1]
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    preferredName: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    program: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [20]
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
      len: [1000]
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [10]
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [10]
    }
  });


  return Event;
};
