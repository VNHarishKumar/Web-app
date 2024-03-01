import logger from '../logger/logger.js';
import User from './../models/assig_user_model.js';
import bcrypt from 'bcrypt';


// ---------------------- AUTHORISATION method --------------------------------------------------
export const authorization = async(req,res) => {
   
   
    const authHeader = req.get('Authorization');



    if (!authHeader) {
        logger.log('error', `Authorisation: No authorisation provided`);
         return 'Not Allowed';
      }
  else{
    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    try {
        // Find the user by username
        const user = await User.findOne({ where: { email: username } });
    
        if (!user) {
        logger.log('error', `Authorisation: User not found`);
        return 'Not User';
        }
    
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
        logger.log('error', `Authorisation: Incorrect password`);
        return 'Incorrect password';
        }
    
        // Generate a Base64-encoded token (containing username or other user data)
        const base64Token = Buffer.from(username).toString('base64');
        
        return user.id;
      } catch (error) {
        logger.log('Error', `Authorisation: Internal server error`);
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } 
    }   
}
