import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import csv from 'csv-parser';
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
dotenv.config();
import sequelize from '../dbloader/dbConnection.js';
import User from  '../models/assig_user_model.js';

const usersToCreate = [];
async function createUserIfNotExists(user) {
    try {
      const existingUser = await User.findOne({ where: { email: user.email } });
  
      if (!existingUser) {
        // Create the user if not found
  
        const hashedPassword = await bcrypt.hash(user.password, 10); // You can adjust the number of salt rounds
  
        // Create the user with the hashed password
        await User.create({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          password: hashedPassword, // Store the hashed password in the database
        });
  
        // await User.create(user);
        console.log(`User created: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    } catch (error) {
      console.error('Error creating users:', error);
    }
  }
  
  
  // ------------------------------ Read and parse the CSV file ------------------------------------

  async function syncUserTable(){
  const filePath =   './opt/user.csv' ;
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Assuming the CSV has columns: firstName, lastName, email, password
      usersToCreate.push({
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        password: row.password,
      });
    })
    .on('end', () => {
      // Initialize the User model
      User.sync().then(() => {
        // Process each user and create it if it doesn't exist
        usersToCreate.forEach((user) => {
          createUserIfNotExists(user);
        });
      });
    });
  
    sequelize.sync({ force : false,alter : true })
    .then(() => {
      console.log('Table created (if not exists) successfully.');
    })
    .catch((err) => {
      console.error('Check database Connection');
    });
}

export default syncUserTable;