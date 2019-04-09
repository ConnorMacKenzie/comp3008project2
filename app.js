const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.listen(process.env.PORT || port, () => console.log(`App running at: http://localhost:${port} or https://stark-mountain-65813.herokuapp.com/` ));

// Middleware to display what is being requested
app.use(express.json());
app.use(function(req, res, next){
    console.log(req.method+" request for " + req.url);
    next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/html/index.html')));

app.post('/password', (req, res) =>{
    console.log(req.body);

    const headers = ["user", "session", "success", "attempt number", "time elapsed (s)", "account type", "password"];

    write_csv("stats.csv", req.body, headers);

    res.send('password received')
});

// Static server for favicon, style, and JS files
app.use(express.static(__dirname + "/public"));

function write_csv(filename, row_obj, headers) {

    let write = fs.createWriteStream(filename, {flags: 'a+'});

    if (fs.existsSync(filename)) {
        write.write(build_csv_string());
    }
    else{
        write.write(build_csv_header());
        write.write(build_csv_string());
    }

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

    function build_csv_string() {

        let ret_string = "";

        for(let i=0; i<headers.length; i++) {

            let value = row_obj[headers[i]];
            console.log("value:", value)
            if (value !== undefined) {

                // So array elements don't get treated as variables in csv
                if (Array.isArray(value)){
                    value = "\"[" + value.toString() + "]\""
                }

                ret_string += value
            }

            if (i === headers.length - 1) {
                ret_string += "\n";
            } else {
                ret_string += ",";
            }
        }
        console.log("ret_string:", ret_string)
        return ret_string;
    }
}
