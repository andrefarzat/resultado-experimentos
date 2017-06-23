'use strict';
var inquirer = require('inquirer');
var _ = require('lodash');
var config = require('./config');
////////
var ask = module.exports = {};
////////
ask.createUnit = function (callback) {
    var questions = [
        {
            type: 'list',
            name: 'type',
            message: 'Unit type:',
            choices: config.units.process
        },
        {
            type: 'input',
            name: 'name',
            message: 'Unit name:',
            validate: required
        },
        {
            type: 'input',
            name: 'module',
            message: 'Module name:',
            validate: required
        }
    ];
    inquirer.prompt(questions, function (answers) {
        var unit = {
            type: answers.type,
            module: { name: answers.module },
            deps: []
        };
        // unit.deps will be populated by reference
        addUnitDependency(unit.deps, function () {
            callback(unit);
        });
    });
};
ask.pickUnit = function (units) {
    var question = {
        type: 'list',
        name: 'unit',
        message: 'What unit do you want to test?',
        choices: function () {
        }
    };
    inquirer.prompt(question, function () {
        var unit;
    });
};
ask.identifyDeps = function (deps, callback) {
    if (!config.dependencies.process.length) {
        return;
    }
    var questions = deps.map(function (dep, index) {
        return {
            type: 'list',
            name: index.toString(),
            message: 'What is a type of "' + dep.name + '"?',
            choices: config.dependencies.process
        };
    });
    inquirer.prompt(questions, function (answers) {
        var identified = _.map(answers, function (type, index) {
            var dep = deps[index];
            dep.type = type;
            return dep;
        });
        callback(identified);
    });
};
////////
function addUnitDependency(deps, callback) {
    if (!config.dependencies.process.length) {
        return callback();
    }
    var questions = [{
            type: 'list',
            name: 'type',
            message: 'Dependency type:',
            choices: config.dependencies.process
        }];
    inquirer.prompt(questions, function (answers) {
    });
}
function required(input) {
    if (isEmptyString()) {
    }
}
function isEmptyString() {
}