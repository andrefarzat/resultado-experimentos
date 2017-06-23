'use strict';
var inquirer = require('inquirer');
var _ = require('lodash');
var config = require('./config');
////////
var ask = module.exports = {};
////////
ask.createUnit = function () {
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
            name: answers.name,
            type: answers.type,
            module: {},
            deps: []
        };
        // unit.deps will be populated by reference
        addUnitDependency(unit.deps, function () {
        });
    });
};
ask.pickUnit = function (units, callback) {
    var question = {
        type: 'list',
        name: 'unit',
        message: 'What unit do you want to test?',
        choices: function () {
        }
    };
    inquirer.prompt(question, function (answer) {
        var unit = units[answer.unit];
        callback(unit);
    });
};
ask.identifyDeps = function (deps, callback) {
    if (!config.dependencies.process.length) {
        return callback([]);
    }
    var questions = deps.map(function (dep) {
        return {
            type: 'list',
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
            choices: config.dependencies.process,
            when: function () {
            }
        }];
    inquirer.prompt(questions, function (answers) {
        // if user types in empty name - finish adding deps
        if (isEmptyString()) {
            return;
        }
        var dep = {
            name: answers.name,
            type: answers.type
        };
        deps.push(dep);
        // recursive, pass deps array along the way until everything resolves
        addUnitDependency(deps);
    });
}
function required() {
}
function isEmptyString(string) {
    return _.isEmpty();
}