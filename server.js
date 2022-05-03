const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var dataServ = require("./data-service.js");
const res = require("express/lib/response");
const exphbs = require ("express-handlebars");
const mongoose = require ("mongoose");
const clientSessions = require("client-sessions");
const { redirect } = require("express/lib/response");

const app = express();


const HTTP_PORT = process.env.PORT || 8090;

app.listen(HTTP_PORT, function () {
    console.log('Node.js listening on port ' + HTTP_PORT);
});


// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");


app.use(express.static('public/css/'));
app.use(express.static('public/images/'));


// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on Port: " + HTTP_PORT);
};

// Setup client-sessions
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "rims05_hairstyling101", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));


// A simple user object, hardcoded for this example
const user = {
  username: "sampleuser",
  password: "samplepassword",
};

// Setup a route on the 'root' of the url to redirect to /login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Display the login html page
app.get("/login", function(req, res) {
  res.render("login", { layout: false });
});

// The login route that adds the user to the session
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === "" || password === "") {
    // Render 'missing credentials'
    return res.render("login", { errorMsg: "Username and Password required.", layout: false });
  }

  // use sample "user" (declared above)
  if(username === user.username && password === user.password){

    // Add the user on the session and redirect them to the dashboard page.
    req.session.user = {
      username: user.username,
    };

    res.redirect("/home");
  } else {
    // render 'invalid username or password'
    res.render("login", { errorMsg: "invalid username or password!", layout: false});
  }
});

// Log a user out by destroying their session
// and redirecting them to /login
app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});


// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

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
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.Product) {
    dataServ.getItemByProductName(req.query.Product)
      .then((data) => {
        console.log(data);
        res.render("inventory", {items: data, layout: false});
      })
      .catch((err) => {
        res.render("inventory", {message: "no results", layout: false});
      })
  }
  else if (req.query.Barcode) {
    dataServ.getItemByBarcode(req.query.Barcode)
      .then((data) => {
        res.render("inventory", {items: data, layout: false});
      })
      .catch((err) => {
        res.render("inventory", {message: "no results", layout: false});
      })
  }
 
  else if (req.query.Quantity) {
    dataServ.getItemByQuantity(req.query.Quantity)
        .then((data) => {
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.Location) {
    dataServ.getItemByLocation(req.query.Location)
        .then((data) => {
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.Brand) {
    dataServ.getItemByBrand(req.query.Brand)
        .then((data) => {
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }
  else if (req.query.Size) {
    dataServ.getItemBySize(req.query.Size)
        .then((data) => {
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          res.render("inventory", {message: "no results", layout: false});
        })
  }


  else {
    dataServ.getAllItems()
        .then((data) => {
         // console.log(data);
          res.render("inventory", {items: data, layout: false});
        })
        .catch((err) => {
          //console.log(err);
          res.render({message: "no results"});
        })
  }
  
  
});

// setup another route to listen on /sales
app.get("/sales", function(req,res){
    res.render("sales", {layout: false});
});

app.get("/inventory/increase", (req,res) => {
  res.redirect("/inventory");
})

app.get("/inventory/increase/:increaseID", (req, res) => {
  dataServ.increaseQuantity(req.params.increaseID).then((data) => {
      res.redirect("/inventory");    
  }).catch((err) => {
      res.status(500).send("Unable to increase quantity/quantity not found");
  });
});

app.get("/inventory/decrease/:decreaseID", (req, res) => {
  dataServ.decreaseQuantity(req.params.decreaseID).then((data) => {
      res.redirect("/inventory");
  }).catch((err) => {
      res.status(500).send("Unable to decrease quantity/quantity not found");
  });
});

app.get("/inventory/delete/:deleteID", (req, res) => {
  dataServ.deleteItem(req.params.deleteID).then((data) => {
      res.redirect("/inventory");
  }).catch((err) => {
      res.status(500).send("Unable to delete quantity/quantity not found");
  });
});


// Inventory bodyparser and post
app.use(bodyParser.urlencoded({extended: true}));

app.post("/inventory", function (req, res) {
    dataServ.addItem(req.body)
        .then(() => {
            res.redirect("/inventory");
        });
});

app.post("/inventory/sell", function (req, res) {
  
  dataServ.sellItem(req.body)
      .then(() => {
          res.redirect("/inventory");
      });
});

app.get(function(req,res){
  res.status(404).send("Status: 404 - Page cannot be found! <br /><a href ='/'>Home</a>?");
});


  