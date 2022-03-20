const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var dataServ = require("./data-service.js");
const res = require("express/lib/response");
const exphbs = require ("express-handlebars");


const app = express();

// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//Render inventory data to table
app.get("/viewInventory", function(req,res){

  dataServ.getInventory()
    .then((data) => {
     // console.log("getInventory JSON.");
      res.render("viewinventory", {viewinventory: data, layout: false});
      
    })
    .catch((err) => {
     // console.log(err);
     res.render({message: "no results"});
    })

  });


app.use(express.static('public/css'));



var HTTP_PORT = process.env.PORT || 8090;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on Port: " + HTTP_PORT);
};




/// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname,"/views/login.html"));
});

app.get("/home", function(req, res){
  res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /inventory
app.get("/inventory", function(req,res){
  
  if (req.query.search) {
    dataServ.getItemBySearch(req.query.search)
        .then((data) => {
          res.render("inventory", {viewinventory: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.productName) {
    dataServ.getItemByProductName(req.query.productName)
      .then((data) => {
        res.render("inventory", {viewinventory: data, layout: false});
      })
      .catch((err) => {
        res.render("inventory", {message: "no results", layout: false});
      })
  }
  else if (req.query.barcode) {
    dataServ.getItemByBarcode(req.query.barcode)
      .then((data) => {
        res.render("inventory", {viewinventory: data, layout: false});
      })
      .catch((err) => {
        res.render("inventory", {message: "no results", layout: false});
      })
  }
 
  else if (req.query.quantity) {
    dataServ.getItemByQuantity(req.query.quantity)
        .then((data) => {
          res.render("inventory", {viewinventory: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.location) {
    dataServ.getItemByLocation(req.query.location)
        .then((data) => {
          res.render("inventory", {viewinventory: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else {
    dataServ.getAllItems()
        .then((data) => {
         // console.log(data);
          res.render("inventory", {viewinventory: data, layout: false});
        })
        .catch((err) => {
          //console.log(err);
          res.render({message: "no results"});
        })
  }
  
  
});

// setup another route to listen on /sales
app.get("/sales", function(req,res){
res.sendFile(path.join(__dirname,"/views/sales.html"));
});



// route / get function calling the export module for employee data validation & parsing.



// Inventory bodyparser and post
app.use(bodyParser.urlencoded({extended: true}));

app.post("/inventory", function (req, res) {
    dataServ.addItem(req.body)
        .then(() => {
            res.redirect("/inventory");
        });
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

  