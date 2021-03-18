# Tic-Tac-Toe Server
Server untuk Tic-Tac-Toe. It performs standard CRUD actions based on RESTful concept.


This app has : 
* RESTful endpoint for e-commerce's CRUD operation

&nbsp;

Tech Stack used to build this app :
* Node JS
* Express JS framework
* PostgreSQL
* Socket.io

&nbsp;


## POST /enter

> Enter with existing name or create a new one

_Request Body_
```
{
    {
      "name" : "user 1"
    },
}
```

_Response (200 - OK)_
```
{
    "name": "user 1",
    "message": "welcome user 1"
}
```

_Response (400 - Bad Request)_
```
{
    "error": "Validation error: please write your name"
}
```
