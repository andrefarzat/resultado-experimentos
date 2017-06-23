const express = require('express');
const app = express();
const path = require('path');
const difflib = require('difflib');

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

app.get('/experimentos', function (req, res) {
    let json = [];

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados");
    var lista = fs.readdirSync(diretorioResultados).filter(file => fs.lstatSync(path.join(diretorioResultados, file)).isDirectory());

    lista.forEach(function (element) {
        json.push({ "text": element, "value": element });
    }, this);

    responseJSON(res, json);
});

app.get('/modelos/:experimentoId', function (req, res) {
    let json = [];
    console.log(req.params.experimentoId);

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados", req.params.experimentoId);

    var lista = fs.readdirSync(diretorioResultados).filter(file => fs.lstatSync(path.join(diretorioResultados, file)).isDirectory());

    lista.forEach(function (element) {
        json.push({ "text": element, "value": element });
    }, this);

    responseJSON(res, json);
});


app.get('/bibliotecas/:experimentoId/:modeloId', function (req, res) {
    let json = [];
    console.log(req.params.experimentoId);
    console.log(req.params.modeloId);

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados", req.params.experimentoId, req.params.modeloId);

    var lista = fs.readdirSync(diretorioResultados).filter(file => fs.lstatSync(path.join(diretorioResultados, file)).isDirectory());

    lista.forEach(function (element) {
        json.push({ "text": element, "value": element });
    }, this);

    responseJSON(res, json);
});

app.get('/graph/:experimentoId/:modeloId/:bibliotecaId', function (req, res) {

    console.log(req.params.experimentoId);
    console.log(req.params.modeloId);
    console.log(req.params.bibliotecaId);

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados", req.params.experimentoId, req.params.modeloId, req.params.bibliotecaId);

    var heuristicas = fs.readdirSync(diretorioResultados).filter(file => fs.lstatSync(path.join(diretorioResultados, file)).isDirectory());

    var data = [];


        var y1 = ['25'];
        var trace1 = {
            y: y1,
            type: 'box',
            name: 'Original'
        };
        data.push(trace1);


    heuristicas.forEach(function (element) {
        var y0 = [Math.random()+1];
        var trace0 = {
            y: y0,
            type: 'box',
            name: element
        };

        data.push(trace0);


    }, this);

    responseJSON(res, data);
});

app.get('/table/:experimentoId/:modeloId/:bibliotecaId', function (req, res) {
    var data = [];

    for (var i = 0; i < 30; i++) {
        data.push({ "RS": `linha ${i}`, "GA": "10", "GA2": "10", "HC": "10", "HC2": "10", "HC3": "10", "HC4": "10", "HC5": "10" });
    }

    responseJSON(res, data);
});


app.get('/diff/:experimentoId/:modeloId/:bibliotecaId/:heuriticaId/:rodada', function (req, res) {
    // 1. Pegar os arquivos
    var leftFile = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    var rightFile = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";

    // 2. Fazer o diff entre eles
    var diff = difflib.unifiedDiff(leftFile.split('\n'), rightFile.split('\n'), {
        fromfile: "esquerda",
        tofile: "direita"
    });

    // 3. Preparar o texto do diff
    var txt = [
        "diff --git a/index b/index",
        "index c732ee8..e49ef2d 100644",
    ].concat(diff);

    // 4. Enviar o json de resposta
    var json = {
        'title': "Título do diff",
        'text': txt.join('\n'),
    };

    responseJSON(res, json);
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});