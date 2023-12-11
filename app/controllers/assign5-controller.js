import { response } from 'express';
import * as databaseService from './../services/assign1-services.js';
import submissions from './../models/assign_submit_model.js';
import logger from './../logger/logger.js';
import * as auth from './../authenticate/authenticate.js';
import { publishToSNS } from './../models/notification_model.js';
import dotenv from "dotenv";
dotenv.config();


export const sub_post = async (req,res) =>{

    const valid = await auth.authorization(req,res);
    const newrecord = req.body;

    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [usernameid, password] = credentials.split(':');

    console.log("Submission Function username value: ",usernameid);
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
         try
         {
        const username = valid;
        const id = req.params.id;
        const testId = await databaseService.checkId(id);
        if (testId == 'Not allowed')
        {
            logger.log('error', `POST: ID not present `);
            setIdErrorResponse({msg:'ID not present'},res);

        }//check for deadline here need to add
        else
        {
               // To get the count of record
               const getIdVal = await databaseService.countId(id);
            //    console.log(getIdVal);
               // console.log("Num_of_attempts:",getIdVal.num_of_attempts);
               // console.log("Deadline",getIdVal.deadline);
   
               // To get the count of Id for checking num_of_attempts
               console.log("Username :",usernameid);
               const Idcount = await  databaseService.countIdVal(usernameid,id);
               console.log("Number of Submissions:",Idcount);

               const newrecord = req.body;

            const allowedFields = ['submission_url'];
            const zipPattern = /\.zip$/;
            
            // Check if there are any extra fields in the newrecord object
            const extraFields = Object.keys(newrecord).filter(key => !allowedFields.includes(key));


            if (extraFields.length > 0) {
                logger.log('error', `Post: Extra field not allowed ${extraFields.join(', ')}`);
                setErrorPostResponse({msg:`Extra fields not allowed: ${extraFields.join(', ')}`}, res);

            }
            else if(!newrecord.submission_url || typeof newrecord.submission_url !== 'string'){
                logger.log('error', `Post: The submission_url need to be a string`);
                setErrorPostResponse({msg:`Submission_url need to be a string`}, res);

            }
            else if (!zipPattern.test(newrecord.submission_url)) {
                logger.log('error', `Post: The submission_url should end with ".zip"`);
                setErrorPostResponse({msg: `Submission_url should end with ".zip"`}, res);
            }
            else{
                    
            const currentTimestamp = new Date().getTime(); // Get the current timestamp in milliseconds
            const deadlineTimestamp = new Date(getIdVal.deadline).getTime();    
            // console.log("currentTimestamp:",currentTimestamp);     
            // console.log("deadlineTimestamp:",deadlineTimestamp);
            if (currentTimestamp < deadlineTimestamp) 
            {
                logger.log('info','The current time is before the deadline.');
                // console.log('The current time is before the deadline.');
                
                if(Idcount === 'Not allowed' || Idcount < getIdVal.num_of_attempts)
                {
                    newrecord.assignment_id=id;
                    newrecord.username=usernameid;
                    const rec =   await submissions.create(newrecord);
                    logger.log('info','Submission created');
                    var entries;
                    // To send sns
                    var topicArn=`${process.env.TOPIC_ARN}`;
                    // var message=`${process.env.MSG}`;
                    var message;
                    // topicArn = 'arn:aws:sns:us-east-1:924858102654:Submission';
                    var url = newrecord.submission_url;
                    // message = 'Assignment Submitted Successfully';
                    // message=`${usernameid},${url}`;
                    if(Idcount === 'Not allowed')
                    {
                        entries = 1;
                    }
                    else{
                        entries = Idcount + 1
                    }
                    message=`${entries},${getIdVal.num_of_attempts},${getIdVal.deadline},${usernameid},${url}`;
                            
                    console.log(message);
                    publishToSNS(topicArn, message, (err, data) => {
                        if (err) {
                          // Handle error
                          res.status(500).json({ error: 'Failed to send notification' });
                        } else {
                        setSuccessfulPostResponse(rec,res);
                        }
                      });



                
                    // setSuccessfulPostResponse(rec,res);
                }
                else
                {

                    // var topicArn;
                    // var message;
                    // topicArn = 'arn:aws:sns:us-east-1:924858102654:Submission';
                    // message = 'Assignment Attempt Limit Exceded';
                    // publishToSNS(topicArn, message, (err, data) => {
                    //     if (err) {
                    //       // Handle error
                    //       res.status(500).json({ error: 'Failed to send notification' });
                    //     } else {
                    //     setAttemptExcedded(res);
                    //     }
                    //   });

                    // console.log("Attempt excedded");
                    setAttemptExcedded(res);
                }
    

            } 
            else 
            {

                // var topicArn;
                // var message;
                // topicArn = 'arn:aws:sns:us-east-1:924858102654:Submission';
                // message = 'Assignment Deadline over';
                // publishToSNS(topicArn, message, (err, data) => {
                //     if (err) {
                //       // Handle error
                //       res.status(500).json({ error: 'Failed to send notification' });
                //     } else {
                //       // Handle success
                //     //   res.status(200).json({ message: 'Notification sent successfully', data });
                //     setTimeExcedded(res);
                //     }
                //   });


                setTimeExcedded(res);
                logger.log('error','The current time is on or after the deadline.');
                console.log('The current time is on or after the deadline.');
            }

        }
           
        }
    }catch(err)
    {

        // var topicArn;
        // var message;
        // topicArn = 'arn:aws:sns:us-east-1:924858102654:Submission';
        // message = 'Assignment Not submmited error occured';
        // publishToSNS(topicArn, message, (err, data) => {
        //     if (err) {
        //       // Handle error
        //       res.status(500).json({ error: 'Failed to send notification' });
        //     } else {
        //       // Handle success
        //     //   res.status(200).json({ message: 'Notification sent successfully', data });
        //     setErrorPostResponse(err,res);
        //     }
        //   });

        console.log("Updated*********************");
        console.log(err);
    setErrorPostResponse(err,res);
    }
    }


}

// -------------------------------------- req, response-----------------------------------------

const setTimeExcedded = (response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(403);
    response.status(400).json({ error: 'Deadline over.Submissions cannot be accepted' });
}

const setAttemptExcedded = (response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(403);
    response.status(400).json({ error: 'Attempt Exceeded.Submissions cannot be accepted' });
}


const setIdErrorResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(404);
    response.json(obj);
    
}

export const  setHeaderErrorResponse =  (res)  => {
    res.set('WWW-Authenticate','Basic realm="Secure Area"');
    res.status(401).json({ error: 'No authorisation header' });
}

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


const setSuccessfulPostResponse = (obj,response) =>{
    response.set('Cache-Control', 'no-cache');
    response.status(201);
    const { username,userid, ...responseObj } = obj.toJSON();
    response.json(responseObj);
}

const setErrorPostResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(400);
    response.json(obj);
    
}