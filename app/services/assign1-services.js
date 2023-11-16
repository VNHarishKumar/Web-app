// import pool from './../models/assign_model.js';
import mysql from 'mysql2/promise';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();
import assignments from "./../models/assign_model.js";
// import {assignments} from "./../models/index.js";
import User from './../models/assig_user_model.js';
import sequelize from '../dbloader/dbConnection.js';

// these method are called from services to do actuall get,post methods

export async function checkDatabaseConnection() {

 try{
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return 'Database Connected';
  }catch (err) {
    console.error('Error connecting to MySQL database:');
    return 'Error Connecting'; // Propagate the error
  }
}



// ------------------------------------------------------- assign-3 route controller function------------------------------------------

// got from amudhan assignment
export const save = async (givenassignment) =>{
  // const newassignment = new assignments(givenassignment);
  // newassignment.save();
  // return newassignment; 
  console.log('Inside save function ');
  await assignments.create(givenassignment)
  .then(newassignment => {
    console.log('New assignment created:', newassignment);
    console.log('Try in save worked');
    // return newassignment;
    return 'Success';
  })
  .catch(error => {
    console.error('Error creating assignment:', error);
    console.log('Error in catch');
    return error; // Handle the error as needed
  });
}

// Get all elements 
export const getAll = async (valid) =>{
  
    const records = await assignments.findAll({
            // where: { userid: valid },
            attributes: { exclude: ['userid'] },
          });
    return records;
}

// Get a particular record
export const getOne = async (valid,id) =>{
  const records = await assignments.findOne({
    where: {  id : id},
    attributes: { exclude: ['userid'] },
  });
  // userid: valid ,
return records;
}

//  to delete a record
export const deleteOne = async (valid,id) =>{
  const records = await assignments.destroy({
    where: {userid: valid , id : id},
  });
  const rec = await assignments.findOne({
    where: {  id : id},
  });
return records;
}

//  to update a record
export const updateOne = async (valid,id,updatedAssignmentData) =>{
  const records = await assignments.findOne({
    where: { userid: valid , id : id},
    attributes: { exclude: ['userid'] },
  });
  if (!records) {
    // return { message: 'Assignment not found or not authorized for update' };
    return 'Not allowed';
  }

  console.log(updatedAssignmentData);
  const [updatedCount] = await assignments.update(updatedAssignmentData, {
    where: { id: id, userid: valid },
  });
  if (updatedCount === 0) {
    return { message: 'No assignment was updated' };
  }

  const updatedRecord = await assignments.findOne({
    where: { id: id, userid: valid },
    attributes: { exclude: ['userid'] },
  });
  return updatedRecord;
}

export const checkId = async (id) => {
  const records = await assignments.findOne({
    where: {  id : id},
    attributes: { exclude: ['userid'] },
  });
  if (!records) {
    // return { message: 'Assignment not found or not authorized for update' };
    return 'Not allowed';
  }

}