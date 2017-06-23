'use strict';
var inquirer = require('inquirer');
var config = require('./config');
////////
var ask = module.exports = {};
////////
ask.createUnit = function () {
    var questions = [{
            type: 'list',
            name: 'type',
            choices: config.units.process
        }];
    inquirer.prompt(questions, function (answers) {
        var unit = { name: answers.name };
        // unit.deps will be populated by reference
        addUnitDependency();
    });
};
ask.pickUnit = function () {
};
ask.identifyDeps = function (deps, callback) {
    if (!config.dependencies.process.length) {
        return;
    }
    var questions = deps.map(function () {
        return {
            type: 'list',
            choices: config.dependencies.process
        };
    });
    inquirer.prompt(questions, function () {
    });
};
////////
function addUnitDependency() {
    if (!config.dependencies.process.length) {
        return;
    }
    var questions = [
        {},
        {
            type: 'list',
            name: 'type',
            choices: config.dependencies.process
        }
    ];
    inquirer.prompt(questions, function () {
        // if user types in empty name - finish adding deps
        if (isEmptyString()) {
        }
    });
}
function isEmptyString() {
}