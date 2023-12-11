import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../dbloader/dbConnection.js';


const submission = sequelize.define('submission', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    username:DataTypes.STRING,
    assignment_id:DataTypes.UUID,
    submission_url:DataTypes.STRING,
  },
  {
    tableName: 'submissions',
    createdAt : 'submission_date',
    updatedAt : 'assignment_updated',
    timestamps : true ,
    defaultValue:{
      accountCreated: Sequelize.literal('CURRENT_TIMESTAMP'),
      accountUpdated: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  }
  );

  export default submission;