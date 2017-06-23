const express = require('express')
const app = express()
const path = require('path');

function responseJSON(res, json) {
    if (typeof json != "string") {
        json = JSON.stringify(json);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(json);
}


app.use(express.static('public'));

app.get('/', function (req, res) {
    let index = path.join(__dirname, 'public', 'index.html');
    res.sendFile(index);
});

app.get('/experimentos', function(req, res) {
    let json = [
        {"text": "Experimento 1", "value": 1},
        {"text": "Experimento 2", "value": 2},
        {"text": "Experimento 3", "value": 3},
        {"text": "Experimento 4", "value": 4},
    ];

    responseJSON(res, json);
});

app.get('/bibliotecas/:experimentoId', function(req, res) {
    console.log(req.params.experimentoId);
    let json = [
        {"text": "Biblioteca 1", "value": 1},
        {"text": "Biblioteca 2", "value": 2},
        {"text": "Biblioteca 3", "value": 3},
        {"text": "Biblioteca 4", "value": 4},
    ];

    responseJSON(res, json);
});

app.get('/graph/:experimentoId/:bibliotecaId', function(req, res) {

    var trace1 = {
        y: [0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15, 8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25],
        type: 'box',
        name: 'All Points',
        jitter: 0.3,
        pointpos: -1.8,
        marker: {color: 'rgb(7,40,89)'},
        boxpoints: 'all'
    };

    var trace2 = {
        y: [0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15, 8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25],
        type: 'box',
        name: 'Only Wiskers',
        marker: {color: 'rgb(9,56,125)'},
        boxpoints: false
    };

    var trace3 = {
        y: [0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15, 8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25],
        type: 'box',
        name: 'Suspected Outlier',
        marker: {color: 'rgb(8,81,156)', outliercolor: 'rgba(219, 64, 82, 0.6)', line: {outliercolor: 'rgba(219, 64, 82, 1.0)', outlierwidth: 2}},
        boxpoints: 'suspectedoutliers'
    };

    var trace4 = {
        y: [0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15, 8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25],
        type: 'box',
        name: 'Wiskers and Outliers',
        marker: {color: 'rgb(107,174,214)'},
        boxpoints: 'Outliers'
    };

    var rand = parseInt(Math.random() * 10, 10);

    var data = [trace4, trace2, trace3, trace1];
    if (rand < 3) {
        data = [trace3, trace2, trace1, trace4]
    } else if (rand < 6) {
        data = [trace2, trace4, trace3, trace1]
    }

    responseJSON(res, data);
});

app.get('/table/:experimentoId/:bibliotecaId', function(req, res) {
    var data = [];

    for(var i = 0; i < 30; i++) {
        data.push({"RS": `linha ${i}`, "GA": "10", "GA2": "10", "HC": "10", "HC2": "10", "HC3": "10", "HC4": "10", "HC5": "10"});
    }

    responseJSON(res, data);
});


app.get('/diff', function(req, res) { // /:experimentoId/:bibliotecaId/:heuriticaId/:rodada

    var prettydiff = require("./prettydiff"),
        args = {
            source: "asdf",
            diff  : "asdd",
            lang  : "text"
        },
        output = prettydiff(args);

    res.send(output);
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});