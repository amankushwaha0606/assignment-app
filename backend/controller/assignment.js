const express = require('express');
const assignmentRouter = express.Router();
require("dotenv").config()
const {assignments} = require('../models/index');
const {authorize}= require('../middleware/authorization')

assignmentRouter.post('/create',authorize(["teacher"]), async (req, res) => {
  try {
    const { title, classId, subject,questions,answers} = req.body;

    await assignments.create({
        title, 
        classId, 
        subject,
        teacherId:req.body.user,
        questions,
        answers
    });

    res.status(200).json({ status: 200, message: 'Assignment created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 500, message: 'Something went wrong' });
  }
});

assignmentRouter.patch('/update/:id',authorize(["teacher"]), async (req, res) => {
    try {
      const { title, classId, subject, teacherId, questions, answers } = req.body;
      const assignmentId = req.params.id;
  
      // Find the assignment by ID in the database
      const assignment = await assignments.findByPk(assignmentId);
  
      // If the assignment is not found, return an error response
      if (!assignment) {
        return res.status(404).json({ status: 404, message: 'Assignment not found' });
      }
  
      // Update the assignment's properties with the new values
      await assignment.update({
        title,
        classId,
        subject,
        teacherId,
        questions,
        answers,
      });
  
      res.status(200).json({ status: 200, message: 'Assignment updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 500, message: 'Something went wrong' });
    }
  });
  



  module.exports={
    assignmentRouter
  }