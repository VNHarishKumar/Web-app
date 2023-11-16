import logger from '../logger/logger.js';
import User from './../models/assig_user_model.js';
import bcrypt from 'bcrypt';


// ---------------------- AUTHORISATION method --------------------------------------------------
export const authorization = async(req,res) => {
    // console.log(req.headers);
    // const authHeader = req.headers['authorization'];
   
    const authHeader = req.get('Authorization');



    if (!authHeader) {
        //  res.status(401).json({ error: 'Authorization header missing' });
        logger.log('error', `Authorisation: No authorisation provided`);
         return 'Not Allowed';
        //  return res.status(401).json({ error: 'Authorization header missing' });
      }
  else{
    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    try {
        // Find the user by username
        const user = await User.findOne({ where: { email: username } });
    
        if (!user) {
        //   return res.status(401).json({ error: 'User not found' });
        logger.log('error', `Authorisation: User not found`);
        return 'Not User';
        }
    
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
        //   return res.status(401).json({ error: 'Invalid password' });
        logger.log('error', `Authorisation: Incorrect password`);
        return 'Incorrect password';
        }
    
        // Generate a Base64-encoded token (containing username or other user data)
        const base64Token = Buffer.from(username).toString('base64');
        
        // return username;
        // logger.log('info', `Authorisation: Authentication Successful`);
        return user.id;
        // res.json({ token: base64Token });
      } catch (error) {
        logger.log('Error', `Authorisation: Internal server error`);
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } 
    }   
}