const express = require('express');
const studentRouter = express.Router();
const bcrypt = require('bcrypt');
require("dotenv").config()
const jwt = require('jsonwebtoken');
const {students} = require('../models/index');
const {assignments}= require('../models/index')
const {authorize}= require("../middleware/authorization")
const {authMiddleware}=require("../middleware/authentication")

studentRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password,Class,attempted } = req.body;

    // Check if user already exists
    const existingUser = await students.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a salt
    const saltRounds = +process.env.SALT_ROUNDS;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create a new user in the database
    await students.create({
      name,
      email,
      password: hashedPassword,
      Class,
      attempted
    });

    res.status(200).json({ status: 200, message: 'User created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});

studentRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await students.findOne({
      where: {
        email: email,
      },
    });
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h', // Token expiration time
    });

    res.status(200).json({ status: 200, message: 'Login successful', token: token, role:"student"});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});

studentRouter.get('/class-assignments',authMiddleware,authorize(["student"]), async (req, res) => {
  try {
    const studentId = req.body.user; // Assuming student's ID is available in req.body.user
    // Use Sequelize to find the student's class based on their ID
    const student = await students.findByPk(studentId, { attributes: ['Class', 'name', 'email', 'id'] });

    if (!student) {
      return res.status(404).json({ status: 404, message: 'Student not found' });
    }

    const studentClass = student.Class; // Get the student's class from the retrieved student data

    // Use Sequelize to query the 'assignments' table for all assignments with matching 'classId'
    const classAssignments = await assignments.findAll({
      where: {
        classId: studentClass,
      },
    });

    // Return the list of assignments as a response to the student
    res.status(200).json({ status: 200, data: classAssignments, studentDetails: student});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});



studentRouter.get("/class-assignment/:id", authMiddleware, authorize(["student"]), async (req, res) => {
  try {
    const assignmentId = req.params.id; // Get the assignment ID from the URL parameter

    // Use Sequelize to find the assignment by its ID
    const assignment = await assignments.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ status: 404, message: 'Assignment not found' });
    }
    res.status(200).json({ status: 200, data: assignment });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});


// studentRouter.post("/submit-answers/:id", authMiddleware, authorize(["student"]), async (req, res) => {
//   try {
//     const studentId = req.body.user; // Assuming the authenticated user's ID is stored in req.user.userId
//     const assignmentId = req.params.id; // Get the assignment ID from the URL parameter

//     // Use Sequelize to find the assignment by its ID
//     const assignment = await assignments.findByPk(assignmentId);

//     if (!assignment) {
//       return res.status(404).json({ status: 404, message: 'Assignment not found' });
//     }

//     // Assuming the student's answers are sent in the request body as an array of strings
//     const studentAnswers = req.body.answers;

//     // Assuming the correct answers are stored in the 'answers' field of the assignment
//     const correctAnswers = assignment.answers;

//     // Compare the student's answers with the correct answers to calculate marks
//     let marks = 0;
//     for (let i = 0; i < correctAnswers.length; i++) {
//       if (studentAnswers[i] === correctAnswers[i]) {
//         marks++;
//       }
//     }

//     // Create a new attempt object with assignment ID, answers, and marks
//     const attempt = {
//       assignmentId: assignmentId,
//       assignment_title:assignment.title,
//       answers: studentAnswers,
//       marks: marks
//     };

//     // Use Sequelize to find the student by their ID
//     const student = await students.findByPk(studentId);

//     if (!student) {
//       return res.status(404).json({ status: 404, message: 'Student not found' });
//     }

//     // Check if the assignment ID is already present in the student's 'attempted' array
//     const hasAttempted = student.attempted.some((attempt) => attempt.assignmentId === assignmentId);

//     if (hasAttempted) {
//       return res.status(400).json({ status: 400, message: 'You have already attempted this assignment' });
//     }

//     // Update the student's 'attempted' field by adding the new attempt to the array
//     const updatedAttempts = [...student.attempted, attempt];

//     // Use Sequelize to update the 'attempted' field in the students table
//     await student.update({ attempted: updatedAttempts });

//     res.status(200).json({ status: 200, message: 'Answers submitted successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ status: 500, message: 'Something went wrong' });
//   }
// });


studentRouter.post("/submit-answers/:id", authMiddleware, authorize(["student"]), async (req, res) => {
  try {
    const studentId = req.body.user; // Assuming the authenticated user's ID is stored in req.body.user
    const assignmentId = req.params.id; // Get the assignment ID from the URL parameter

    // Use Sequelize to find the assignment by its ID
    const assignment = await assignments.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ status: 404, message: 'Assignment not found' });
    }

    // Assuming the student's answers are sent in the request body as an array of strings
    const studentAnswers = req.body.answers;

    // Assuming the correct answers are stored in the 'answers' field of the assignment
    const correctAnswers = assignment.answers;

    // Compare the student's answers with the correct answers to calculate marks
    let marks = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (studentAnswers[i] === correctAnswers[i]) {
        marks++;
      }
    }

    // Create a new attempt object with student ID, answers, and marks
    const attempt = {
      studentId: studentId,
      studentName: "", // We'll fill this later
      answers: studentAnswers,
      marks: marks
    };
    const student_attempt = {
      assignmentId: assignmentId,
      assignment_title:assignment.title,
      answers: studentAnswers,
      marks: marks
    };
    // Find the student by their ID to get the student's name
    const student = await students.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ status: 404, message: 'Student not found' });
    }
    const hasAttempted = student.attempted.some((student_attempt) => student_attempt.assignmentId === assignmentId);

    if (hasAttempted) {
      return res.status(400).json({ status: 400, message: 'You have already attempted this assignment' });
    }

    const updatedAttempts = [...student.attempted, student_attempt];

    // Use Sequelize to update the 'attempted' field in the students table
    await student.update({ attempted: updatedAttempts });


    // Add the student's name to the attempt object
    attempt.studentName = student.name;

    // Get the existing students array from the assignment's 'students' field
    const existingStudents = [...assignment.students,attempt]
    // Use Sequelize to update the 'students' field in the assignments table
    await assignment.update({ students: existingStudents });

    res.status(200).json({ status: 200, message: 'Answers submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});




studentRouter.get("/attempted-assignments/:studentId", authMiddleware, authorize(["student"]), async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find the student by ID
    const student = await students.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ status: 404, message: 'Student not found' });
    }

    // Get the attempted assignments for the student
    const attemptedAssignments = await student.attempted;
    console.log(attemptedAssignments)
    res.status(200).json({ status: 200, data: attemptedAssignments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});

  module.exports={
    studentRouter
  }