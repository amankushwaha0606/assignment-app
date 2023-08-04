const express = require('express');
const teacherRouter = express.Router();
const bcrypt = require('bcrypt');
require("dotenv").config()
const jwt = require('jsonwebtoken');
const {Teachers} = require('../models/index');
const {authMiddleware}= require("../middleware/authentication")
const {authorize}= require('../middleware/authorization')
const {assignments}= require('../models/index')
teacherRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password,subject,assignment} = req.body;

    // Check if user already exists
    const existingUser = await Teachers.findOne({
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
    await Teachers.create({
      name,
      email,
      password: hashedPassword,
      subject,
      assignment
    });

    res.status(200).json({ status: 200, message: 'User created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});

teacherRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Teachers.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email,role:user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h', // Token expiration time
    });

    res.status(200).json({ status: 200, message: 'Login successful', token: token, role:"teacher"});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});


// Define the route to get teacher's assignments
teacherRouter.get('/assignments', authMiddleware, authorize(["teacher"]),async (req, res) => {
  try {
    const teacherId = req.body.user; // Assuming the authenticated teacher's ID is stored in req.user.teacherId

    // Use Sequelize to find the teacher by their ID
    const teacher = await Teachers.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({ status: 404, message: 'Teacher not found' });
    }

    // Use Sequelize to fetch all assignments associated with the teacher's ID
    const Assignments = await assignments.findAll({
      where: { teacherId: teacherId },
    });

    res.status(200).json({ status: 200, assignments: Assignments });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});


// Define the route to get a specific assignment of a teacher
teacherRouter.get('/assignments/:assignmentId', authMiddleware, authorize(["teacher"]), async (req, res) => {
  try {
    const teacherId = req.body.user; // Assuming the authenticated teacher's ID is stored in req.body.user
    const assignmentId = req.params.assignmentId; // Get the assignment ID from the URL parameter

    // Use Sequelize to find the teacher by their ID
    const teacher = await Teachers.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({ status: 404, message: 'Teacher not found' });
    }

    // Use Sequelize to fetch the specific assignment associated with the teacher's ID and the provided assignmentId
    const assignment = await assignments.findOne({
      where: { id: assignmentId, teacherId: teacherId },
    });

    if (!assignment) {
      return res.status(404).json({ status: 404, message: 'Assignment not found for this teacher' });
    }

    res.status(200).json({ status: 200, assignment: assignment });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});




  module.exports={
    teacherRouter
  }