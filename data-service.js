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

// getEmployees Function

module.exports.getInventory = function () {
    
    this.promise = new Promise((resolve,reject) => {

        if(inventory.length === 0) {
            var error = "No data found for employees...";
            reject({message: error});
        }

        resolve (inventory);
    })

    return this.promise;
};