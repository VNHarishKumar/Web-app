import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../dbloader/dbConnection.js';
import dotenv from "dotenv";
dotenv.config();


  // assignments is the table name 

  const assignments = sequelize.define('assignments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name:DataTypes.STRING,
    points: {
      type:DataTypes.INTEGER,validate: {
      min: 0,  // Minimum points allowed
      max: 10, // Maximum points allowed
    },
  },
    num_of_attempts: {type:DataTypes.INTEGER,validate: {
      min: 1,  // Minimum points allowed
      max: 3, // Maximum points allowed
    },},
    deadline: DataTypes.DATE,
    userid: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'assignments',
    createdAt : 'assignment_created',
    updatedAt : 'assignment_updated',
    timestamps : true ,
    defaultValue:{
      accountCreated: Sequelize.literal('CURRENT_TIMESTAMP'),
      accountUpdated: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  }
  );

// -------------------- Synchronize the model with the database. It check the schema if table or schema change it updates-------------------------
// sequelize.sync({ force: false,alter:true })
//       .then(() => {
//         console.log('Table created (if not exists) successfully.');

        
//       })
//       .catch((err) => {
//         console.error('Check database Connection');
//       });
  
export default assignments;

