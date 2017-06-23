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

    //var heuristicas = fs.readdirSync(diretorioResultados).filter(file => fs.lstatSync(path.join(diretorioResultados, file)).isDirectory());
    var FileResultsBoxPlot = path.join(diretorioResultados, "Results-grouped-Boxplot.csv");
    var textoResultadoCompleto = fs.readFileSync(FileResultsBoxPlot, 'utf8');

    var data = [];

    if (textoResultadoCompleto.length !== 0) {
        var linhasResultado = textoResultadoCompleto.split("\n");
        var nome = '';
        var y0 = [];

        for (var index = 1; index < linhasResultado.length; index++) {
            var linha = linhasResultado[index];
            if (linha && linha.length !== 0) {
                //heuristic,trial,originalIndividualAvgTime,originalIndividualLOC,originalIndividualCharacters,bestIndividualAvgTime,bestIndividualLOC,bestIndividualCharacters,time,better
                var dadosDoResultado = linha.split(",");
                nome = nome == "" ? dadosDoResultado[0] : nome;

                if (nome.trim() != dadosDoResultado[0].trim() && y0.length > 0) {

                    data.push({
                        y: y0,
                        type: 'box',
                        name: nome
                    });

                    nome = dadosDoResultado[0];
                    y0 = [];
                }

                if (dadosDoResultado[7] && dadosDoResultado[10] == "true") //se encontrou melhor
                    y0.push(dadosDoResultado[7].replace(',', '.'));

            }
        }

        if (y0.length > 0) { //sobrou um

            data.push({
                y: y0,
                type: 'box',
                name: nome
            });
        }
    }

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