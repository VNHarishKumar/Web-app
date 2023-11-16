// import mysql from 'mysql2';
import express from "express";
import cors from "cors";
// import models from "./models/assign_model.js";
import bodyParser from "body-parser";
import route from "./routes/index.js";
import basicAuth from 'express-basic-auth';
import fs from 'fs';
import csv from 'csv-parser';
// import * as auth from './../authenticate/authenticate.js';
import { authorization } from "./authenticate/authenticate.js";


const app =express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.text());
app.use(express.urlencoded());


// const users = {};

//   fs.createReadStream('./opt/user.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     users[data.email] = data.password;
//   })
//   .on('end', () => {
//     // Authentication middleware
//     const authMiddleware = basicAuth({
//       users: users,
//       challenge: true, // Display a browser authentication dialog
//       unauthorizedResponse: 'Unauthorized',
//     });

// app.use('/v1/assignments', authMiddleware); 





route(app);
  // });
export default app;