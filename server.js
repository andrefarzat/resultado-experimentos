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

    var resultado = {};
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
    var FileAnaliseTempoExecucao = path.join(diretorioResultados, "analiseTempoExecucao.csv");
    var textoResultado = fs.readFileSync(FileAnaliseTempoExecucao, 'utf8');
    var linhas = textoResultado.split("\n");
    var arrValores = linhas[1].split(";");
    var originalCodeChars = parseFloat(arrValores[5].replace(',', '.'));

    data.push({
        y: [originalCodeChars],
        type: 'box',
        name: 'Original'
    });


    if (textoResultadoCompleto.length !== 0) {
        var linhasResultado = textoResultadoCompleto.split("\n");
        var nome = '';
        var y0 = [];

        for (var index = 2; index < linhasResultado.length; index++) {
            var linha = linhasResultado[index];
            if (linha && linha.length !== 0) {
                //heuristic,trial,originalIndividualAvgTime,originalIndividualLOC,originalIndividualCharacters,bestIndividualAvgTime,bestIndividualLOC,bestIndividualCharacters,time,better
                var dadosDoResultado = linha.split(";");
                nome = nome == "" ? dadosDoResultado[1].trim() : nome;

                if (nome.trim() != dadosDoResultado[1].trim()) {

                    data.push({
                        y: y0,
                        type: 'box',
                        name: nome
                    });

                    nome = dadosDoResultado[1].trim();
                    y0 = [];
                }

                var valor = parseFloat(dadosDoResultado[5].replace(',', '.'));
                if (!isNaN(valor) && valor < originalCodeChars)
                    y0.push(valor);

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



    resultado['data'] = data;
    resultado['layout'] = {
        title: req.params.bibliotecaId,
        shapes: [
            {
                type: 'line',
                x0: 0,
                y0: originalCodeChars,
                x1: originalCodeChars,
                y1: originalCodeChars,
                name: 'Original Code',
                xref: 'paper',
                line: {
                    color: 'rgb(50, 171, 96)',
                    width: 2,
                    dash: 'solid',
                    name: 'line'
                }
            }
        ]
    };

    responseJSON(res, resultado);
});

app.get('/table/:experimentoId/:modeloId/:bibliotecaId', function (req, res) {

    console.log(req.params.experimentoId);
    console.log(req.params.modeloId);
    console.log(req.params.bibliotecaId);

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados", req.params.experimentoId, req.params.modeloId, req.params.bibliotecaId);

    //Lib;Heuristic;Trial;Lines;% Improved Loc;Chars;% Improved Chars;Instructions;% Improved Instructions;Time Spent
    var FileAnaliseTempoExecucao = path.join(diretorioResultados, "analiseTempoExecucao.csv");
    var textoResultadoCompleto = fs.readFileSync(FileAnaliseTempoExecucao, 'utf8');
    var data = [];
    var objetoResultado = {};

    if (textoResultadoCompleto.length !== 0) {
        var linhasResultado = textoResultadoCompleto.split("\n");
        for (var index = 2; index < linhasResultado.length; index++) {
            var linha = linhasResultado[index];
            if (linha.length > 0) {
                var dadosDoResultado = linha.split(";");
                var valor = parseFloat(dadosDoResultado[6].replace(',', '.'));

                if (!isNaN(valor) && valor > 0)
                    objetoResultado[dadosDoResultado[1]] = [valor, dadosDoResultado[2]];
            }
        }
    }
    data.push(objetoResultado);

    responseJSON(res, data);
});


app.get('/diff/:experimentoId/:modeloId/:bibliotecaId/:heuriticaId/:rodada', function (req, res) {

    console.log(req.params.experimentoId);
    console.log(req.params.modeloId);
    console.log(req.params.bibliotecaId);
    console.log(req.params.heuriticaId);
    console.log(req.params.rodada);

    const fs = require('fs');
    const path = require('path');
    var diretorioResultados = path.join(__dirname, "resultados", req.params.experimentoId, req.params.modeloId, req.params.bibliotecaId, req.params.heuriticaId);

    var arquivoOriginal = path.join(diretorioResultados, "original.js");
    var arquivoRodada = path.join(diretorioResultados, req.params.rodada + ".js");

    var codigoOriginal = fs.readFileSync(arquivoOriginal, 'utf8');
    var codigoRodada = fs.readFileSync(arquivoRodada, 'utf8');

    // 1. Pegar os arquivos
    var leftFile = codigoOriginal;
    var rightFile = codigoRodada;

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
        'title': req.params.heuriticaId + " rodada " + req.params.rodada,
        'text': txt.join('\n'),
    };

    responseJSON(res, json);
});


app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
});