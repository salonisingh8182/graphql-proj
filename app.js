const express = require('express');              
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require("fs");
const { DataStore } = require('notarealdb');
const { report } = require('process');

//initialize the database
const db = new DataStore('database');
const studentDB = db.collection('studentData');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(fs.readFileSync("schema.graphql").toString());  //returns a buffer but buildschema needs string so we convert to string


// root provides a resolver function for each API endpoint or CRUD functionality
const root = {
listStudents: () => {
    return studentDB.list()
},
getStudent: (argument) => {
    return studentDB.get(argument.id)
},
createStudent: (argument) => {
    const studentStuff = {
        id: argument.id,
        name: argument.name,
        age: argument.age 
    }
    return studentDB.create(studentStuff);  
},
deleteStudent: (argument) => {
    const studentObj = studentDB.get(argument.id);
    studentDB.delete(argument.id);
    
    return studentObj;  
},
updateStudent: (argument) => {
    const studentStuff = {
        id: argument.id,
        name: argument.name,
        age: argument.age 
    }
    studentDB.update(studentStuff);
    const studentObj = studentDB.get(argument.id);
    
    return studentObj;
}
};

//Creating a GraphQL API Server

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(3000);
console.log('Running a GraphQL API server at http://localhost:3000/graphql');