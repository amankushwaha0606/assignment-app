module.exports = (sequelize, DataTypes) => {
    const students = sequelize.define("students", {
      name: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      Class: DataTypes.INTEGER,
      attempted: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      role:{
        type: DataTypes.STRING,
        defaultValue: "student"
      }
    });
    return students;
  };
  


  