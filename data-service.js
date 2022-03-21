const fs = require("fs");
const { resolve } = require("path");

var inventory = [];


// Load data into GLOBAL arrays...

module.exports.loadData = function (){

    var promise = new Promise((resolve,reject) => {

        try {

            fs.readFile('./data/viewinventory.json', (error, data) => {
                if (error) throw error;

                inventory = JSON.parse(data);

            })
                
        } catch (ex) {
            console.log("Failure...");
            reject("Failure...");
        }
                console.log("Successful...");
                resolve("Successful...");
        })    

    return promise;
};


// 
module.exports.addItem = function(inventoryData) {

    var promise = new Promise((resolve, reject) => {

        inventory.push(inventoryData);

        resolve (inventory);
    })

    return promise;
}

// setup function getItemByProductName
module.exports.getItemByProductName = function (productNameID) {
    var locItem = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i].productName == productNameID) {
                locItem.push(inventory[i]);
            }
        }

        if (locItem.length === 0) {
            var err = "getItemByProductName() does not have any data.";
            reject({message: err});
        }

    resolve (locItem);
    })
    return promise;
};

module.exports.getItemByBarcode = function (barcodeID) {
    var locItem = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i].barcode == barcodeID) {
                locItem.push(inventory[i]);
            }
        }

        if (locItem.length === 0) {
            var err = "getItemByBarcode() does not have any data.";
            reject({message: err});
        }

    resolve (locItem);
    })
    return promise;
};

module.exports.getItemByQuantity = function (quantityID) {
    var locItem = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i].quantity == quantityID) {
                locItem.push(inventory[i]);
            }
        }

        if (locItem.length === 0) {
            var err = "getItemByQuantity() does not have any data.";
            reject({message: err});
        }

    resolve (locItem);
    })
    return promise;
};

module.exports.getItemByLocation = function (locationID) {
    var locItem = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i].location == locationID) {
                locItem.push(inventory[i]);
            }
        }

        if (locItem.length === 0) {
            var err = "getItemByLocation() does not have any data.";
            reject({message: err});
        }

    resolve (locItem);
    })
    return promise;
};

module.exports.getAllItems = function() {
    var promise = new Promise((resolve, reject) => {

        if (inventory.length === 0) {
            var err = "No results returned in getAllItems";
            reject({message: err});
        }
        resolve (inventory);
    })
    return promise;
};

module.exports.getItemBySearch = function (searchID) {
    var locItem = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i].productName == searchID || inventory[i].barcode == searchID ||
                 inventory[i].quantity == searchID || inventory[i].location == searchID) {
                locItem.push(inventory[i]);
            }
        }

        if (locItem.length === 0) {
            var err = "getItemBySearch() does not have any data.";
            reject({message: err});
        }

    resolve (locItem);
    })
    return promise;
};


