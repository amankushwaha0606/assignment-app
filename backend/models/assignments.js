module.exports = (sequelize, DataTypes) => {
    const assignments = sequelize.define("assignments", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questions: {
        type: DataTypes.JSON, // Use JSON data type
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON, // Use JSON data type
        allowNull: false,
      },
      students:{
        type: DataTypes.JSON, // Use JSON data type
        allowNull: false,
        defaultValue: []
      }
    });
    return assignments;
  };

  
  