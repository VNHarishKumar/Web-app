import { Sequelize, DataTypes } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
    dialect: 'mysql', // Specify the database dialect you're using (e.g., 'mysql', 'postgres', 'sqlite', etc.)
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });
  

 export default async function databaseCheck()
  {
    try{
        
        await sequelize.authenticate();
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`);
    console.log("Databses ensured");
    
    }catch(err)
    {
        console.log(err);
    }finally
    {
        await sequelize.close();
    }
  }
  

  
 

  
 