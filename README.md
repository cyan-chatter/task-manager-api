# task-manager-api
https://chatter-task-king-web.herokuapp.com/


Environment Variables to be set up by the user:
  PORT
  SENDGRID_API_KEY
  JWT_SECRET
  MONGODB_URL
  
Note:
Use separate Environment variable: MONGODB_URL for develeopement and testing purposes so that the data in Database for development does not get overwritten by the data used for testing purposes.     
At app deployment to Heroku, The Environment variable: PORT is automatically set up by Heroku while the others required to be provided to Heroku by using heroku config command. 
