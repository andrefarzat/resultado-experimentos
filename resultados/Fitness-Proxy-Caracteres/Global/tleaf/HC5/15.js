var inquirer = require('inquirer');
var _;
var config = require('./config');
////////
var ask = module.exports = {};
////////
ask.createUnit = function () {
    var questions = [{
            name: 'type',
            choices: config.units.process
        }];
    inquirer.prompt(questions, function (answers) {
        var unit;
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
    var questions = deps.map(function (dep, index) {
        return { choices: config.dependencies.process };
    });
    inquirer.prompt(questions, function () {
    });
};
////////
function addUnitDependency(deps, callback) {
    if (!config.dependencies.process.length) {
        return;
    }
    var questions = [{
            name: 'type',
            choices: config.dependencies.process
        }];
    inquirer.prompt(questions, function () {
    });
}