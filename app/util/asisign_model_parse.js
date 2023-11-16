import sequelize from '../dbloader/dbConnection.js';
import assignments from  '../models/assign_model.js';
// import Users from '../models/assign_user_model.js';


assignments.sync({ force: false,alter:true })
      .then(() => {
        console.log('Table created (if not exists) successfully.');

        
      })
      .catch((err) => {
        console.error('Check database Connection');
      });