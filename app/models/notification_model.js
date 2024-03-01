// notificationModel.js

import AWS from 'aws-sdk';
import dotenv from "dotenv";
dotenv.config();



AWS.config.update({
  region: process.env.REGION
});


const sns = new AWS.SNS();
export const publishToSNS = (topicArn, message, callback) => {
  const params = {
    Message: message,
    TopicArn: topicArn
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error('Error publishing message:', err);
      callback(err, null);
    } else {
      console.log('Message published successfully:', data);
      callback(null, data);
    }
  });
};
