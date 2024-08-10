const http = require('http');

const express = require('express');

const app = express();


// ********* 2 *********
// app.use((req,res,next) => {
//     console.log('First middleware');
//     next();
// })

// app.use((req,res) => {
//     console.log('second middleware');
// })



// *********** 3 ***********

app.use('/users', (req,res) => {
    res.send("<h1> Users </h1>");
});

app.use('/', (req,res) => {
    res.send("<h1>ExpressJS</h1>");
});

app.listen(3000);