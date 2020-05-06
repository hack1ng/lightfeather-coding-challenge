const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// allow for JSON requests
app.use(bodyParser.json());
app.use(errorHandler);

// catch-all error handler for bad requests, return 500 + empty string
function errorHandler (err, req, res, next) {
    res.status(500).json({"EncodedMessage" : ""});
}

app.get('/', (req, res) => {
    res.send('LightFeather Coding Challenge');
});

app.post('/api/encode', (req, res) => {
    // grab parameters from post request
    const message = req.body.Message;
    const shift = req.body.Shift;

    // create encoded message
    let encodedMessage = '';

    // validate message is a string and shift is an integer
    if (isNaN(shift) || typeof message !== 'string') {
        // throw 500 error and return emtpy string
        res.status(500).json({"EncodedMessage" : ""});
    } else {
        // parse shift to make sure it's used as an integer value
        const shiftInt = parseInt(shift, 10);

        // loop through all characters in string
        for (let i = 0; i < message.length; i++) {
            let char = message.charAt(i);
            let charCode = message.charCodeAt(i);
            const alphaRegex = /[a-z]/i;

            // test to see if it's an alpha character and shift accordingly
            // do not shift spaces (and other non-alpha characters)
            if(alphaRegex.test(char)){
                // if uppercase, shift within uppercase range
                if ((charCode >= 65) && (charCode <= 90)) {
                    char = String.fromCharCode(((charCode - 65 + shiftInt) % 26) + 65);
                }
                // if lowercase, shift within lowercase range
                else if ((charCode >= 97) && (charCode <= 122)) {
                    char = String.fromCharCode(((charCode - 97 + shiftInt) % 26) + 97);
                }
            }
            encodedMessage += char;
        }

        // write encoded message to file
        fs.writeFile('encodedMessage.txt', encodedMessage, function (err) {
            if (err) res.status(500).json({"EncodedMessage" : ""});
        });

        // return 200 (default) success code and encoded messsage
        res.json({"EncodedMessage" : encodedMessage});
    }
});

// listen on application port
const port = 23456;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
