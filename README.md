# task-manager-api

You can create requests on the following URL for certain operation of your Task Management App :grin:

**https://chatter-task-king-web.herokuapp.com/**

## Requests Permitted

### **Users**

### GET
- /users/me : Get the data of the particular logged-in user 
- /users/me/avatar : Get the avatar image of the particular logged-in user 

### POST
- /users : Register new user
- /users/login : Login an existing user
- /users/logout : Logout a logged-in user from the requested device
- /users/logoutAll : Logout the user from all the logged-in devices
- /users/me/avatar : Set an avatar image

### PATCH
- /users/me : Modify user personal data

### DELETE
- /users/me : Remove the user from the system
- /users/me/avatar : Remove the avatar image 

### **Tasks**

### GET
- /tasks : Get all the tasks posted by the user
- /tasks/:id : Get a particular task posted by the user

### POST
- /tasks : Post a particular task
### PATCH
- /tasks/:id : Modify a particular task

### DELETE
- /tasks/:id : Delete a particular task

### **Admins**

### GET
- /admin/users/:id : Get Data of a particular user
- /admin/users : Get data of all registered users
- /admin/users/:id/avatar : Get avatar image of a particular user
- /admin/users/:userID/tasks : Get Tasks of a particular user
- /admin/users/:userID/tasks/:taskID : Get a particular task of a particular user

### POST
- /admin/login : Login an admin 
- /admin/logout : Logout an admin

### PATCH
- /admin/users/:id : Modify the data of a user as admin privilige
- /admin/users/:userID/tasks/:taskID : Modify a particular task of a user as admin privilige

### DELETE
- /admin/users/:id : Delete a user from the system as admin privilige
- /admin/users/:userID/tasks/:taskID : Delete a particualar task of a particular user as admin privilige


### Sidenote

If the documentaion does not provide sufficient information then it is recommended to go through the code of the API once to understand how to interact with it.

Environment Variables to be set up by the user:
  PORT
  SENDGRID_API_KEY
  JWT_SECRET
  MONGODB_URL
  
Note:
Use separate Environment variable: MONGODB_URL for develeopement and testing purposes so that the data in Database for development does not get overwritten by the data used for testing purposes.     

