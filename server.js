var path = require("path");
var express = require("express");
var app = express();

app.use(express.static('public/css'));

var dataServ = require("./data-service.js");
const res = require("express/lib/response");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
};

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

// route / get function calling the export module for employee data validation & parsing.

app.get("/employees", function(req,res){

  dataServ.getEmployees()
        .then((data) => {
          console.log("getEmployees...");
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        })
});

// route / get function calling the export module for manager data retrieval.

app.get("/managers", function(req,res){

  dataServ.getManagers()
        .then((data) => {
          console.log("getManagers...");
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        })
});

// route / get function calling the export module for department data retrieval.

app.get("/departments", function(req,res){

  dataServ.getDepartments()
        .then((data) => {
          console.log("getDepartments...");
          console.log("Complete.")
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        })
});

app.get(function(req,res){
  res.status(404).send("Status: 404 - Page cannot be found! <br /><a href ='/'>Home</a>?");
});

// call loadData function & setup http server to listen on HTTP_PORT
console.log("Data Loading...");
  dataServ.loadData()
    .then(() => {
      app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(error => {
        console.log(error);
    })
