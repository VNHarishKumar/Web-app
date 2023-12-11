// notificationModel.js

import AWS from 'aws-sdk';
import dotenv from "dotenv";
dotenv.config();



AWS.config.update({
  region: process.env.REGION
});


const sns = new AWS.SNS();

// const firstTopicParams = {
//     Name: 'Submission'
//   };



// Creaating topic

// sns.createTopic(firstTopicParams, (err, submissionData) => {
//     if (err) {
//       console.error('Error creating HealthzTopic:', err);
//     } else {
//       console.log('HealthzTopic created successfully:', submissionData);
//       subscribeEmail(submissionData.TopicArn, 'harishkumarvaithyannandhagopu@gmail.com');
//     }
//   });


//   Creating Subscribers list


// const subscribeEmail = (topicArn, emailAddress) => {
//     // Check if the email is already subscribed to the topic
//     sns.listSubscriptionsByTopic({ TopicArn: topicArn }, (err, data) => {
//       if (err) {
//         console.error('Error checking subscriptions:', err);
//         return;
//       }
  
//       const subscriptionExists = data.Subscriptions.some(sub => sub.Endpoint === emailAddress);
  
//       if (subscriptionExists) {
//         console.log('Email address is already subscribed:', emailAddress);
//         return;
//       }
  
//       // If not subscribed, proceed with the subscription
//       const params = {
//         Protocol: 'email',
//         TopicArn: topicArn,
//         Endpoint: emailAddress
//       };
  
//       sns.subscribe(params, (subscribeErr, subscribeData) => {
//         if (subscribeErr) {
//           console.error('Error subscribing email address:', subscribeErr);
//         } else {
//           console.log('Email address subscribed successfully:', subscribeData);
//           // Note: For email subscriptions, a confirmation is usually sent to the email address.
//         }
//       });
//     });
//   };
// Publishing to SNS

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
