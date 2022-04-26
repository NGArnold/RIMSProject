const { resolve } = require("path");
const mongoose =require ("mongoose");
const { stat } = require("fs");
var Schema = mongoose.Schema;
// connect to your MongoDB Atlas Database
mongoose.connect("mongodb+srv://user1:admin@rims.ssq4p.mongodb.net/RIMS?retryWrites=true&w=majority");


const userSchema = new Schema({
    userName: String,
    password: String,
    userId: String
});

const itemSchema = new Schema({
    Brand: String,
    Product: String, 
    Size: String, 
    Quantity: Number, 
    Location: String, 
    Barcode: Number,
    Sold: { type: Number, default: 0 },
    LatestSold: String
});

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema); 

itemSchema.index(
    {
        Brand: 'text',
        Product: 'text', 
        Size: 'text', 
        Quantity: 'text', 
        Location:'text', 
        Barcode: 'text'
    }
)



// add item function
module.exports.addItem = function(inventoryData) {

    return new Promise(function (resolve, reject) {

        for (const prop in inventoryData) {
            if (inventoryData[prop] == "") {
                inventoryData[prop] = null;
            }
        }
            Item.create(inventoryData)
            .then(() => {
                resolve();
            }).catch((error) => {
                reject("Unable to create employee.");
            });
    });
    
};

// setup function getItemByProductName
module.exports.getItemByProductName = function (productNameID) {
    return new Promise((resolve, reject) => {
        console.log(productNameID);
        Item.find({ Product: productNameID }).lean().exec()
        .then((data) => {
            console.log(data);
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};


module.exports.getItemByBarcode = function (barcodeID) {
    return new Promise((resolve, reject) => {
        
        Item.find({ Barcode: barcodeID }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.getItemByQuantity = function (quantityID) {
    return new Promise((resolve, reject) => {
        
        Item.find({ Quantity: quantityID }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.getItemByLocation = function (locationID) {
    return new Promise((resolve, reject) => {
        
        Item.find({ Location: locationID }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};


module.exports.getItemByBrand = function (brandID) {
    return new Promise((resolve, reject) => {
        
        Item.find({ Brand: brandID }).lean().exec()
        .then((data) => {
            
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};



module.exports.getItemBySize = function (sizeID) {
    return new Promise((resolve, reject) => {
        
        Item.find({ Size: sizeID }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};



module.exports.getAllItems = function() {
    return new Promise((resolve, reject) => {

        Item.find({}).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}

module.exports.getItemsByStatistics = function(statID) {
    
    var organization = "desc";

    if (statID == "notSellingWell") {
        organization = "asc";
    }

    return new Promise((resolve, reject) => {

        Item.find({}).sort({Sold: organization}).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}

module.exports.getAllSoldItems = function(statID) {

    return new Promise((resolve, reject) => {

        Item.find({}).sort({Sold: "desc"}).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}


module.exports.increaseQuantity = function (increaseID) {

    return new Promise((resolve, reject) => {
        
        Item.findOneAndUpdate({Barcode: increaseID}, {$inc: { Quantity: 1 }})
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}


module.exports.decreaseQuantity = function (decreaseID) {
    return new Promise((resolve, reject) => {
        
        Item.findOneAndUpdate({Barcode: decreaseID}, {$inc: { Quantity: -1 }})
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}

module.exports.deleteItem = function (deleteID) {
    return new Promise((resolve, reject) => {

        Item.deleteOne({ Barcode: deleteID }).exec()
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to delete item.");
        });
    });
};

module.exports.sellItem = function (sellData) {

    var values = Object.values(sellData);

    var locQuantity = parseInt(values[0]);
    var locBarcode = parseInt(values[1]);

    return new Promise((resolve, reject) => {
        
        Item.findOneAndUpdate({Barcode: locBarcode}, {$inc: { Quantity: -locQuantity }})
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
};

module.exports.salesStats = function(sellData) {

    var values = Object.values(sellData);

    var locQuantity = parseInt(values[0]);
    var locBarcode = parseInt(values[1]);

    const d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var date = month + "/" + day + "/" + year;

    

    return new Promise(function (resolve, reject) {
        console.log(date);
        Item.findOneAndUpdate({Barcode: locBarcode}, {$inc: { Sold: locQuantity }, LatestSold: date })
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
    
};

module.exports.getItemBySearch = function (searchID) {
    return new Promise((resolve, reject) => {
        
        Item.find({$text: {$search: "\"" + searchID + "\"" }}).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.editItem = function (editData) {


    return new Promise((resolve, reject) => {
        for (const prop in editData) {
            if (editData[prop] == "") {
                editData[prop] = null;
            }
        } 
        Item.updateOne({Barcode: editData.Barcode},
            {Brand: editData.Brand, 
            Product: editData.Product,
            Size: editData.Size,
            Quantity: editData.Quantity, 
            Location: editData.Location,
            Barcode: editData.Barcode}   
            )
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to update item.");
        });
        
    });
};
