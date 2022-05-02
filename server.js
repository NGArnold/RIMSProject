const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var dataServ = require("./data-service.js");
const res = require("express/lib/response");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();


const HTTP_PORT = process.env.PORT || 8090;

app.listen(HTTP_PORT, function () {
  console.log('Node.js listening on port ' + HTTP_PORT);
});


// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");


app.use(express.static('public/css'));


// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on Port: " + HTTP_PORT);
};




/// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});



// setup another route to listen on /inventory
app.get("/inventory", function (req, res) {

  if (req.query.search) {
    dataServ.getItemBySearch(req.query.search)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }
  else if (req.query.Product) {
    dataServ.getItemByProductName(req.query.Product)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }
  else if (req.query.Barcode) {
    dataServ.getItemByBarcode(req.query.Barcode)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }

  else if (req.query.Quantity) {
    dataServ.getItemByQuantity(req.query.Quantity)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }
  else if (req.query.Location) {
    dataServ.getItemByLocation(req.query.Location)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }
  else if (req.query.Brand) {
    dataServ.getItemByBrand(req.query.Brand)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }
  else if (req.query.Size) {
    dataServ.getItemBySize(req.query.Size)
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render("inventory", { message: "no results", layout: false });
      })
  }


  else {
    dataServ.getAllItems()
      .then((data) => {
        res.render("inventory", { items: data, layout: false });
      })
      .catch((err) => {
        res.render({ message: "no results", layout: false });
      })
  }


});

// setup another route to listen on /sales
app.get("/sales", function (req, res) {
  if (req.query.Stat) {
    dataServ.getItemsByStatistics(req.query.Stat)
      .then((data) => {
        res.render("sales", { items: data, layout: false });
      })
      .catch((err) => {
        res.render({ message: "no results", layout: false });
      })
  } else {
    dataServ.getAllSoldItems()
      .then((data) => {
        res.render("sales", { items: data, layout: false });
      })
      .catch((err) => {
        res.render({ message: "no results", layout: false });
      })
  }

});

app.get("/inventory/increase", (req, res) => {
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

app.get("/editItem/:editID", (req, res) => {
  
  dataServ.getItemByID(req.params.editID).then((data) => {
      res.render("editItem", { item: data, layout: false });
  }).catch((err) => {
      res.render("editItem", { message: "no results", layout: false });
  });
});


// Inventory bodyparser and post
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/editItem/update", (req, res) => {
  dataServ.editItem(req.body).then(() => {
      res.redirect("/inventory");
  });
});

app.post("/inventory/add", function (req, res) {
  dataServ.addItem(req.body)
    .then(() => {
      res.redirect("/inventory");
    });
});

app.post("/home/sell", function (req, res) {

  if (req.body.Quantity != "" && req.body.Barcode != "") {
    dataServ.sellItem(req.body)
    .then(() => {
      dataServ.salesStats(req.body)
        .then(() => {
          res.redirect("/home");
        });
    });
  } else {
    res.redirect("/home");
  }
});

app.post("/inventory/sell", function (req, res) {

  if (req.body.Quantity != "" && req.body.Barcode != "") {
    dataServ.sellItem(req.body)
    .then(() => {
      dataServ.salesStats(req.body)
        .then(() => {
          res.redirect("/inventory");
        });
    });
  } else {
    res.redirect("/inventory");
  }
  
});

app.post("/sales/sell", function (req, res) {

  if (req.body.Quantity != "" && req.body.Barcode != "") {
    dataServ.sellItem(req.body)
    .then(() => {
      dataServ.salesStats(req.body)
        .then(() => {
          res.redirect("/sales");
        });
    });
  } else {
    res.redirect("/sales");
  }

});


app.get(function (req, res) {
  res.status(404).send("Status: 404 - Page cannot be found! <br /><a href ='/'>Home</a>?");
});


