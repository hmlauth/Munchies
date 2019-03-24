// require connection established in CONNECTION.JS file which was exported for ORM use
var connection = require("../config/connection.js");

// ++++++++++++++++++++++++++++++++++++++++++++++++
// HELPER FUNCTIONS - Prep question marks and object key/pair values before passing through ORM.
// ++++++++++++++++++++++++++++++++++++++++++++++++

// Create a helper function to create the appropriate number of question marks for the query strings in the orm.
function printQuestionMarks(input) {
    var array = [];

    for (var i = 0; i < input.lenght; i++) {
        array.push("?");
    }

    return array.toString()
}

// Create a second helper function to convert key/value pairs to mySql syntax. This function accepts the object from pulled from the client-side.
function objToSql(ob) {
    var arr = [];

    for (var key in obj) {
        // set the value of respective key as variable value
        var value = ob[key];

        // if the object passed through has 
        if (Object.hasOwnProperty.call(ob, key)) {
            // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
            if (typeof value === "string" && value.indexOf(" ") >= 0) {
                value = "'" + value + "'";
            }
            // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
            // e.g. {sleepy: true} => ["sleepy=true"]
            arr.push(key + "=" + value);

        }
            // translate array of strings to a single comma-separated string
            return arr.toString();
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++
// BUILD ORM - Object for all our SQL statement functions
// ++++++++++++++++++++++++++++++++++++++++++++++++
var orm = {
    // tableInput is the name of the table defined in your model
    select: function(tableInput, cb) {
        var queryString = "SELECT * FROM " + tableInput + ";";
        connection.query(queryString, function(err, results) {
            console.log("selectAll err", err)
            if (err) {
                throw err
            }
            cb(results);
        });
    },
    insert: function(table, cols, vals, cb) {
        var queryString = "INSERT INTO " + table;
        queryString += " (" + cols.toString() + ") VALUES (";
        queryString += printQuestionMarks(vals.length) + ") ";
        console.log("insertOne queryString: ", queryString);

        connection.query(queryString, vals, function(err, results) {
            if (err) {
                console.log("insertOne err", err)
                throw err;
            }
            cb(results);
        })

    },
    update: function(table, objColVals, condition, cb) {
        var queryString = "UPDATE " + table + " SET ";
        queryString += objToSql(objColVals) + " WHERE " + condition;
        console.log("updateOne queryString", queryString);

        connection.query(queryString, function(err, results) {
            if (err) {
                console.log("updateOne err", err);
                throw err
            }

            cb(results);
        })
    }
}

// Export the orm object for the model (cat.js).
module.exports = orm;