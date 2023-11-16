import { response } from 'express';
import * as databaseService from './../services/assign1-services.js';
import logger from './../logger/logger.js';

// For correct get method success and error response
export const checkConnectionController = async(req,res) => {


    const result = await databaseService.checkDatabaseConnection();
    const a = req.body;
    const b=JSON.stringify(a);
    if( result === 'Database Connected')
    {
        
        if( (Object.keys(req.query).length > 0) || (req.body && Object.keys(req.body).length > 0) )
        {
            console.log("\nInput given inside the body",JSON.stringify(a));
            
            setBadrequest(result,res);
        }
        else
        {
            console.log('\nNo Payload available');
            logger.log('info', `Get method: successful DB connection available`);
            setSuccessfulResponse(result,res);
        }
    
    
    }
    else
    {
        if((req.body && Object.keys(req.body).length > 0))
        {
            logger.log('error', `Get method: Query parameter not allowed`);
            setBadrequest(result,res)
        }
        else{
            logger.log('error', `Get method: No Database coonnection`);
            setErrorResponse(req,res);
        }   
    }
}



// for remaining API calls with incorrect end points
export const checkOtherMethod = async(req,res) => {
   

    const a = req.body
      
    if(req.body && Object.keys(req.body).length > 0)
    {
        console.log("\nWrong end points and Input given inside the body",JSON.stringify(a));
        logger.log('error', `${req.method}: Wrong end points and Input given inside the body`);
        setMethodNotAllowed(req,res);
    }
    else
    {
        console.log(' \nWrong end point and No Payload available, ');
        logger.log('error', `${req.method}: Wrong end point `);
        setMethodNotAllowed(req,res);
    }


}

// 405 error for correct end points for POST,DELETE,PUT,PATCH
export const checkOtherMethod1 = async(req,res) => {
    
    const a = req.body
        
        if(req.body && Object.keys(req.body).length > 0)
        {
            console.log("\nCorrect end points , Input given inside the body. But, request not allowed",JSON.stringify(a));
            logger.log('error', `${req.method}: Correct end point but method not allowed and having payload`);
            setMethodNotAllowed1(req,res);
        }
        else
        {
            logger.log('error', `${req.method}: Correct end point but method not allowed and not having payload`);
            console.log(' \nCorrect end point , No Payload available. But, request not allowed ');
            setMethodNotAllowed1(req,res);
        }


}

// newely added for test
export const setSuc = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(200).send();
    
}


// Succesful get method with coreect end point
const setSuccessfulResponse = (obj,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(200).send();
    
}

//  error response with correct get method
const setErrorResponse = (err,response) =>{
    response.set('Cache-Control', 'no-cache');
    response.status(503).send();
    
}

// function called from checkOtherMethod
const setMethodNotAllowed = (err,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(404).send();
    
}

// function called from checkOtherMethod1
const setMethodNotAllowed1 = (err,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(405).send();
    
}

const setBadrequest = (err,response) =>
{
    response.set('Cache-Control', 'no-cache');
    response.status(400).send();
}

// ----------------------------------- ASSIGNMENT 3 new end point----------------------------------------

// newly adding for assignment 3 , post method to accept the json input
