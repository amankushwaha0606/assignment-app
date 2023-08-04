module.exports = (sequelize, DataTypes) => {
  const Teachers = sequelize.define("Teachers", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role:{
      type: DataTypes.STRING,
      defaultValue: "teacher"
    },
    // assignments: {
    //   type: DataTypes.TEXT, // Use TEXT for storing the JSON string
    //   defaultValue: '[]', // Default value as an empty JSON array
    //   get() {
    //     const rawValue = this.getDataValue('assignments');
    //     return JSON.parse(rawValue); // Parse the JSON string to get the array
    //   },
    //   set(val) {
    //     this.setDataValue('assignments', JSON.stringify(val)); // Convert the array to JSON string before storing
    //   },
    // },
  });

  return Teachers;
};




