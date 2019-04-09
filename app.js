/*
*  This Express Node.js server is responsible for:
*
*   Handling all requests:
*       homepage
*       sounds
*       images
*       password
*
*   Adding password info to CSV
*
* */

// Get Express, Path, and Filesystem
const express = require('express');
const path = require('path');
const fs = require('fs');

// Init express
const app = express();

// Set port
const port = 3000;

// Listen on port 3000
app.listen(port, () => console.log(`App running at: http://localhost:${port}`));

// Middleware to display what is being requested
app.use(express.json());

// Logs request type and path
app.use(function(req, res, next){
    console.log(req.method + " request for " + req.url);
    next();
});

// Route for homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/html/index.html')));

// Post password info
app.post('/password', (req, res) =>{

    // Headers for CSV
    const headers = ["user", "session", "success", "attempt number", "time elapsed (s)", "account type", "password"];

    // Writes to CSV using object and header info
    write_csv("stats.csv", req.body, headers);

    // Success message
    res.send('password received')
});

// Static server for favicon, style, and JS files
app.use(express.static(__dirname + "/public"));

// Function for writing to CSV
function write_csv(filename, row_obj, headers) {

    // Open (or create) file to write data to
    let write = fs.createWriteStream(filename, {flags: 'a+'});

    // File exits so only write data
    if (fs.existsSync(filename)) {
        write.write(build_csv_string());
    }

    // File didn't exist so write headers then data
    else{
        write.write(build_csv_header());
        write.write(build_csv_string());
    }

    // Constructs CSV header string
    function build_csv_header() {

        let ret_string = "";

        for(let i=0; i<headers.length; i++) {
            ret_string += headers[i]

            if (i === headers.length - 1) {
                ret_string += "\n";
            } else {
                ret_string += ",";
            }
        }
        return ret_string
    }

    // Constructs CSV data string
    function build_csv_string() {

        // Init string
        let ret_string = "";

        for(let i=0; i<headers.length; i++) {

            let value = row_obj[headers[i]];

            // Don't log undefined values
            if (value !== undefined) {

                // So array elements don't get treated as variables in csv
                if (Array.isArray(value)){
                    value = "\"[" + value.toString() + "]\""
                }

                // Append value
                ret_string += value
            }

            // New line on last value, comma otherwise
            if (i === headers.length - 1) {
                ret_string += "\n";
            } else {
                ret_string += ",";
            }
        }

        // Log CSV string
        console.log("ret_string:", ret_string)

        return ret_string;
    }
}