var inquirer = require('inquirer');
var _ = require('lodash');
var config = require('./config');
////////
var ask = module.exports = {};
////////
ask.createUnit = function () {
    var questions = [{
            name: 'type',
            choices: config.units.process
        }];
    inquirer.prompt(questions, function () {
        var unit = {};
        // unit.deps will be populated by reference
        addUnitDependency();
    });
};
ask.pickUnit = function () {
};
ask.identifyDeps = function (deps, callback) {
    if (!config.dependencies.process.length) {
        return callback([]);
    }
    var questions = deps.map(function (index) {
        return {
            name: index.toString(),
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
    var questions = [{
            name: 'type',
            message: 'Dependency type:',
            choices: config.dependencies.process,
            when: function () {
            }
        }];
    inquirer.prompt(questions, function () {
    });
}
function required() {
}