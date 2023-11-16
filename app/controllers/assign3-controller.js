import { response } from 'express';
import * as databaseService from './../services/assign1-services.js';
import bcrypt from 'bcrypt';
import { Sequelize ,DataTypes, Model} from 'sequelize';
import User from './../models/assig_user_model.js';
// import {User} from './../models/index.js';
import assignments from './../models/assign_model.js';
import * as auth from './../authenticate/authenticate.js';
import logger from './../logger/logger.js';

// ---------------- POST , GET , GET{id} , DELETE, PUT ------------------------------------


export const post = async (req,res) =>{

    const valid = await auth.authorization(req,res);
    const newrecord = req.body;

    if(valid == 'Not Allowed')
    {
        setHeaderErrorResponse(res);
    }
    else if(valid == 'Not User')
    {
        setUserErrorResponse(res);
    }
    else if(valid == 'Incorrect password')
    {
        setPswdErrorResponse(res);
    }
    else{

        // console.log(newrecord);
        try{

            const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
            
            // Check if there are any extra fields in the newrecord object
            const extraFields = Object.keys(newrecord).filter(key => !allowedFields.includes(key));


            if (extraFields.length > 0) {
                logger.log('error', `Post: Extra field not allowed ${extraFields.join(', ')}`);
                setErrorPostResponse({msg:`Extra fields not allowed: ${extraFields.join(', ')}`}, res);
            } 
            else if(!newrecord.name || typeof newrecord.name !== 'string')
            {
                logger.log('error', `Post: Name field required and in String format. Entered Name:${newrecord.name}`);
             setErrorPostResponse({msg:'Name field required and need to be a String format'},res);
            }
            else if(!newrecord.points || typeof newrecord.points !== 'number' || newrecord.points % 1 !== 0)
            {
                logger.log('error', `Post: Points field required and be in Integer format. Entered points:${newrecord.points}`);
                setErrorPostResponse({msg:'Points field required and need to be in integer format'},res);
            }
            else if(!newrecord.num_of_attempts || typeof newrecord.num_of_attempts !== 'number' || newrecord.num_of_attempts % 1 !== 0)
            {
                logger.log('error', `Post: Attempt field needed and be in Integer format. Entered attempts:${newrecord.num_of_attempts}`);
                setErrorPostResponse({msg:'Attempt field required and need to be in integer format'},res);
            }
            else if(!newrecord.deadline || !isValidDeadlineFormat(newrecord.deadline))
            {
                logger.log('error', `Post: Invalid Date Format. Entered Deadline:${newrecord.deadline}. Needed Format:2023-10-09T23:42:18.000Z`);
                setErrorPostResponse({msg:'Invalid deadline format. Please use the format "2023-10-09T23:42:18.000Z"'},res);
            }
        else{
                    newrecord.userid = valid;

                  const rec =   await assignments.create(newrecord)

  .then(newassignment => {
    // console.log('New assignment created:', newassignment);
    // console.log('Try in save worked');
    // setSuccessfulResponse(newassignment,res);
    logger.log('info', `Post method: successful New assignment created. details: ${JSON.stringify(newassignment)}`);
    setSuccessfulPostResponse(newassignment,res); 
  })
  .catch(error => {
    // console.error('Error creating assignment:', error);
    // console.log('Error in catch');
    logger.log('error', `New assignment not created check points or atempts field. Points in range between 0 to 10 and attempts between 1 to 3`);
    setErrorPostResponse({msg:'Points in range between 0 to 10 and attempts between 1 to 3'},res);
  });
   }
    }catch(err)
            {
            setErrorPostResponse(err,res);
            }

   
}
}

function isValidDeadlineFormat(deadline) {
    const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return deadlineRegex.test(deadline);
}

// getting all the value for particular user
export const getAllRecordsByUsername = async (req, res) => {


    const valid = await auth.authorization(req,res);
    if(valid == 'Not Allowed')
    {
        setHeaderErrorResponse(res);
    }
    else if(valid == 'Not User')
    {
        setUserErrorResponse(res);
    }
    else if(valid == 'Incorrect password')
    {
        setPswdErrorResponse(res);
    }
    else
    {
        const username = valid;
        // console.log(username);
        const getAllRecords = await databaseService.getAll(username);
        logger.log('info', `Get All method successful`);
          setSuccessfulGetResponse(getAllRecords,res);
        }
    
     
  }

//   get value with a id
export const getARecord = async (req, res) => {


    const valid = await auth.authorization(req,res);
    if(valid == 'Not Allowed')
    {
        setHeaderErrorResponse(res);
    }
    else if(valid == 'Not User')
    {
        setUserErrorResponse(res);
    }
    else if(valid == 'Incorrect password')
    {
        setPswdErrorResponse(res);
    }
    else
    {
        
        const username = valid;
        const id = req.params.id;
        const testId = await databaseService.checkId(id);
        if (testId == 'Not allowed')
        {
            logger.log('error', `GET: ID not present `);
            setIdErrorResponse({msg:'ID not present'},res);
            // setIdErrorResponse('No content available for this ID',res);
        }

        else{
        const username = valid;
        const id = req.params.id;
        // console.log(username);
        
        const getARecord = await databaseService.getOne(username,id);
      if (getARecord)
      {
        logger.log('info', `GET: Get method successful `);
        setSuccessfulGetResponse(getARecord,res);
      }
      else{
        setSuccessfulGetResponse({msg:'Record Not Found'},res);
      }
    }
      
    }
     
  }

//   delete value with id

export const removeARecord = async (req, res) => {
    const valid = await auth.authorization(req, res);

    if (valid === 'Not Allowed') {
        setHeaderErrorResponse(res);
    } else if (valid === 'Not User') {
        setUserErrorResponse(res);
    } else if (valid === 'Incorrect password') {
        setPswdErrorResponse(res);
    } else {
        const username = valid;
        const id = req.params.id;
        const testId = await databaseService.checkId(id);

        if (testId === 'Not allowed') {
            logger.log('info', `DELETE: ID not present `);
            setIdErrorResponse({msg:'Id not available'}, res);
        } else {
            if (Object.keys(req.body).length > 0) {
                // If req.body is not empty, return an error response
                // setPayloadNotAllowedResponse('Payload not allowed', res);
                logger.log('error', `DELETE: Payload not allowed `);
                setErrorPostResponse({msg:'Payload not allowed'},res);
            } else {
                const getARecord = await databaseService.deleteOne(username, id);

                if (getARecord) {
                    logger.log('info', `DELETE: Deleted Successfully `);
                    setSuccessfulDeleteResponse(getARecord, res);
                } else {
                    setErrorDeleteResponse(getARecord, res);
                }
            }
        }
    }
}


//   update method for given id
export const updateARecord = async (req, res) => {
    const valid = await auth.authorization(req, res);

    if (valid === 'Not Allowed') {
        setHeaderErrorResponse(res);
    } else if (valid === 'Not User') {
        setUserErrorResponse(res);
    } else if (valid === 'Incorrect password') {
        setPswdErrorResponse(res);
    } else {
        const username = valid;
        const id = req.params.id;
        const testId = await databaseService.checkId(id);
        const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
        console.log(testId);
        // if (testId === 'Not allowed') {
        //     setPutIdErrorResponse({msg:'Invalid Id provided'}, res);
        // }
        //  else
        //  {   
        // Check if there are any extra fields in the newrecord object
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
        if (extraFields.length > 0) {
            logger.log('error', `PUT: Extra field not allowed `);
            setErrorPostResponse({msg:`Extra fields not allowed: ${extraFields.join(', ')}`}, res);
        } 
        else if (testId === 'Not allowed') {
            logger.log('error', `PUT: Id not present `);
            setPutIdErrorResponse({msg:'Invalid Id provided'}, res);
        } else {
            console.log(username);

            if (Object.keys(req.body).length === 0) {
                console.log("Hello world");
                setPutEmptyResponse({msg:"bad request, req body required"}, res);
            } else if (!req.body.name || typeof req.body.name !== 'string') {
                logger.log('error', `PUT: Name field is required and format should be Integer `);
                setErrorPostResponse({msg:'Name field is required and format should be Integer'}, res);
            } else if (req.body.points) {
                const point = req.body.points;
                
                // console.log("Point inside update value", point);

                if (!Number.isInteger(point) || point < 0 || point > 10) {
                    logger.log('error', `PUT: Points should be an integer in the range 0 to 10 `);
                    setErrorPostResponse({msg:'Points should be an integer in the range 0 to 10'}, res);
                } else {
                    const point1 = req.body.num_of_attempts;
                    console.log("Attempts inside update value", point1);

                    if (!Number.isInteger(point1) || point1 < 1 || point1 > 3) {
                        logger.log('error', `PUT: Attempts should be an integer in the range 1 to 3 `);
                        setErrorPostResponse({msg:'Attempts should be an integer in the range 1 to 3'}, res);
                    } else if (req.body.deadline && !isValidDeadlineFormat(req.body.deadline)) {
                        logger.log('error', `PUT: Invalid deadline format `);
                        setErrorPostResponse({msg:'Invalid deadline format'}, res);
                    } else {
                        // Remove "assignment_created" and "assignment_updated" fields
                        delete req.body.assignment_created;
                        delete req.body.assignment_updated;
                        
                        const getARecord = await databaseService.updateOne(username, id, req.body);

                        if (getARecord === 'Not allowed') {
                            setPutErrorResponse(getARecord, res);
                        } else {
                            logger.log('info', `PUT: Method Successful `);
                            setSuccessfulUpdateResponse(getARecord, res);
                        }
                    }
                }
            } else if (req.body.num_of_attempts) {
                const point1 = req.body.num_of_attempts;
                // console.log("Attempts inside update value", point1);

                if (!Number.isInteger(point1) || point1 < 1 || point1 > 3) {
                    logger.log('error', `PUT: Attempts should be an integer in the range 1 to 3 `);
                    setErrorPostResponse({msg:'Attempts should be an integer in the range 1 to 3'}, res);
                } else if (req.body.deadline && !isValidDeadlineFormat(req.body.deadline)) {
                    logger.log('error', `PUT: Invalid deadline format `);
                    setErrorPostResponse({msg:'Invalid deadline format'}, res);
                } else {
                    // Remove "assignment_created" and "assignment_updated" fields
                    delete req.body.assignment_created;
                    delete req.body.assignment_updated;

                    const getARecord = await databaseService.updateOne(username, id, req.body);

                    if (getARecord === 'Not allowed') {
                        setPutErrorResponse(getARecord, res);
                    } else {
                        logger.log('info', `PUT: Successful response `);
                        setSuccessfulUpdateResponse(getARecord, res);
                    }
                }
            } else if (req.body.deadline && !isValidDeadlineFormat(req.body.deadline)) {
                logger.log('error', `PUT: Invalid deadline format `);
                setErrorPostResponse({msg:'Invalid deadline format'}, res);
            } else {
                // Remove "assignment_created" and "assignment_updated" fields
                delete req.body.assignment_created;
                delete req.body.assignment_updated;

                const getARecord = await databaseService.updateOne(username, id, req.body);

                if (getARecord === 'Not allowed') {
                    setPutErrorResponse(getARecord, res);
                } else {
                    logger.log('info', `PUT: Method Successful  `);
                    setSuccessfulUpdateResponse(getARecord, res);
                }
            }
        }
    }
}
// }
// ------------------------------- Responses for different method --------------------------

const setSuccessfulResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(200);
    const { userid, ...responseObj } = obj.toJSON();
    response.json(responseObj);
    
}

const setSuccessfulPostResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(201);
    const { userid, ...responseObj } = obj.toJSON();
    response.json(responseObj);
    
}

const setSuccessfulGetResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(200);
    response.json(obj);
    
}

const setErrorDeleteResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(403).send({msg:'created user only can delete record'});
}

const setSuccessfulDeleteResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(204).send({msg:'Record Deleted'});
}



const setSuccessfulUpdateResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(204);
    console.log("inside update success function");
    response.json(obj);
    
}

// Error responses for aboe methods 


const setUserErrorResponse = (res) =>
{
    res.set('Cache-Control', 'no-cache');
    res.status(401).json({ error: 'User not found' });
}

const setPswdErrorResponse = (res) =>
{
    res.set('Cache-Control', 'no-cache');
    res.status(401).json({ error: 'Invalid password' });
}

const setErrorPostResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(400);
    response.json(obj);
    
}

// setPutErrorResponse
const setPutErrorResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(403);
    response.json(obj);
    
}

const setPutIdErrorResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(404);
    response.json(obj);
    
}
const setPutEmptyResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(400);
    response.json(obj);
    
}

const setDeleteIdErrorResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(204);
    response.json(obj);
    
}

const setIdErrorResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(404);
    response.json(obj);
    
}

export const notFound = async(req,res) =>{
    res.status(404).end();

}
export const notAllowed = async(obj,res) =>{
    res.status(405).end();


}

export const  setHeaderErrorResponse =  (res)  => {
    res.set('WWW-Authenticate','Basic realm="Secure Area"');
    res.status(401).json({ error: 'No authorisation header' });
}