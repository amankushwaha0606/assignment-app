const express = require("express");
const cors = require('cors');
const db = require("./models/index");
const app = express();
const {authMiddleware}=require("./middleware/authentication")
const {studentRouter}= require("./controller/student");
const { teacherRouter } = require("./controller/teacher");
const { assignmentRouter } = require("./controller/assignment");
app.use(cors());
app.use(express.json());




app.get("/",(req,res)=>{
  res.send("welcome")
})

app.use("/student",studentRouter)
app.use("/teacher",teacherRouter)
app.use(authMiddleware);
app.use("/assignment",assignmentRouter)

db.sequelize.sync().then(() => {
  app.listen(4500, () => {
    console.log("Second Server Started");
  });
});

// 1. Download -> extra sequelize-cli
// 2. npx sequelize-cli init
// 3. Provide DB Details in Config.json file
// Define models in models folder
