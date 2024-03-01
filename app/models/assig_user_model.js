import { Sequelize, DataTypes } from 'sequelize';
// const { Sequelize, DataTypes } = require('sequelize');
import fs from 'fs';
import csv from 'csv-parser';
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
dotenv.config();
import sequelize from '../dbloader/dbConnection.js';


// ------------------------------------------- USER CREATION ------------------------------------------------
const usersToCreate = [];

const User =  sequelize.define('user',{
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true, // Ensure email uniqueness
  },
  password: DataTypes.STRING,
},
  {tableName: 'user',
});
  

export default User;
