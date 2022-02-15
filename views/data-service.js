const fs = require("fs");
const { resolve } = require("path");

var employees = [];
var managers = [];
var departments = [];

// Load data into GLOBAL arrays...

module.exports.loadData = function (){

    var promise = new Promise((resolve,reject) => {

        try {

            fs.readFile('./data/employees.json', (error, data) => {
                if (error) throw error;

                employees = JSON.parse(data);

            })

            fs.readFile('./data/departments.json', (error,data) => {
                if (error) throw error;

                departments = JSON.parse(data);

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

module.exports.getEmployees = function () {
    
    this.promise = new Promise((resolve,reject) => {

        if(employees.length === 0) {
            var error = "No data found for employees...";
            reject({message: error});
        }

        resolve (employees);
    })

    return this.promise;
};

// getManagers Function

module.exports.getManagers = function () {
    
    this.promise = new Promise((resolve,reject) => {

        for(var i=0; i < employees.length; i++){
            
            if (employees[i].isManager == true) {
           managers.push(employees[i]);
        }
    }

    if (managers.length === 0) {

        this.error = "No data found for managers...";
        reject({message: this.error});
    }

        resolve (managers);
    })

    return this.promise;
};

// getDepartments Function

module.exports.getDepartments = function () {
    
    this.promise = new Promise((resolve,reject) => {

        if(departments.length === 0) {
            this.error = "No data found for departments...";
            reject({message: this.error});
        }

        resolve (departments);
    })

    return this.promise;
};