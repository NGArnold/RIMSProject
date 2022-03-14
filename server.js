const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var dataServ = require("./data-service.js");
const res = require("express/lib/response");
const exphbs = require ("express-handlebars");


const app = express();

//setting handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
                            defaultLayout: "main",
                            helpers: {       
                                      navLink: function(url, options){
                                      return '<li' +
                                     ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                                     '><a href="' + url + '">' + options.fn(this) + '</a></li>';},

                                     equal: function (lvalue, rvalue, options) {
                                     if (arguments.length < 3)
                                     throw new Error("Handlebars Helper equal needs 2 parameters");
                                     if (lvalue != rvalue) {
                                     return options.inverse(this);
                                     } else {
                                     return options.fn(this); }}  
                  }
}));
app.set('view engine', '.hbs');

//This will add the property "activeRoute" to "app.locals" whenever the route changes, ie: if our route is
//"/employees/add", the app.locals.activeRoute value will be "/employees/add
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
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
  //res.sendFile(path.join(__dirname,"/views/home.html"));
  res.render("home");
});

// setup another route to listen on /inventory
app.get("/inventory", function(req,res){
  //res.sendFile(path.join(__dirname,"/views/inventory.html"));
  res.render("inventory");
});

// setup another route to listen on /sales
app.get("/sales", function(req,res){
//res.sendFile(path.join(__dirname,"/views/sales.html"));
res.render("sales");
});

// route / get function calling the export module for employee data validation & parsing.

app.get("/viewinventory", function(req,res){

  dataServ.getInventory()
        .then((data) => {
          console.log("getInventory...");
          res.json(data);
        })
        .catch((error) => {
          console.log(error);
          res.json(error);
        })
});

// Inventory bodyparser and post
app.use(bodyParser.urlencoded({extended: true}));

app.post("/inventory", function (req, res) {
    dataServ.addItem(req.body)
        .then(() => {
            res.redirect("/viewinventory");
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
