#!/usr/bin/env node

var fetch = require("node-fetch");
var fs = require('fs');
var inquirer = require('inquirer');
var settings = null;


try {
    settings = require("./settings.json");
    fetchBoards(settings);
} catch (e) {
    var questions = [{
        type: 'input',
        name: 'key',
        message: "App Key:",
        validate: function validate(value) {
            return value.length === 32;
        }
    }, {
        type: 'input',
        name: 'token',
        message: "User token:",
        validate: function validate(value) {
            return value.length === 64;
        }
    }];
    console.log('You need an trello app key as well as a user token. You can grab both of them here: https://trello.com/app-key');
    inquirer.prompt(questions).then(function (answers) {
        settings = answers;
        fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), 'utf-8', null);
        fetchBoards();
    });
}

function fetchBoards() {
    fetch('https://api.trello.com/1/members/me/boards?key=' + settings.key + '&token=' + settings.token).then(function (response) {
        response.json().then(function (json) {
            var boards = [];
            for (var i = 0, len = json.length; i < len; i++) {
                var entry = json[i];
                if (entry.closed === false) {
                    boards.push({
                        key: entry.name.charAt(0),
                        name: entry.name,
                        value: entry.id
                    });
                }
            }

            inquirer.prompt({
                type: 'list',
                name: 'board',
                message: "Board?",
                choices: boards
            }).then(function (answers) {
                var board = answers.board;
                fetchLists(board);
            });
        });
    }).catch(function (error) {
        console.log(error);
    });
}

function fetchLists(board) {
    fetch('https://api.trello.com/1/boards/' + board + '/lists?key=' + settings.key + '&token=' + settings.token).then(function (response) {
        response.json().then(function (json) {

            var lists = [];
            for (var i = 0, len = json.length; i < len; i++) {
                var entry = json[i];
                lists.push({
                    name: entry.name,
                    value: entry.id
                });
            }

            inquirer.prompt({
                type: 'list',
                name: 'list',
                message: 'List?',
                choices: lists
            }).then(function (answers) {
                var list = answers.list;

                fetchCards(board, list);
            });
        });
    }).catch(function (error) {
        console.log(error);
    });
}

function fetchCards(board, list) {

    fetch('https://api.trello.com/1/boards/' + board + '/cards?key=' + settings.key + '&token=' + settings.token).then(function (response) {
        response.json().then(function (json) {
            var cards = {};
            for (var i = 0, len = json.length; i < len; i++) {

                var entry = json[i];
                if (entry.idList === list) {
                    for (var j = 0, _len = json.length; j < _len; j++) {
                        if (entry.labels[j]) {
                            var label = entry.labels[j] ? entry.labels[j].name : 'sonstige';
                            if (!cards[label]) {
                                cards[label] = [];
                            }
                            cards[label].push({name: entry.name, url: entry.shortUrl});
                        }
                    }
                }
            }

            Object.keys(cards).forEach(function (element, key, _array) {
                var labelGroup = cards[element];
                console.log('');
                console.log(element + ':');
                // console.log(resultSet);
                for (var _i = 0, _len2 = labelGroup.length; _i < _len2; _i++) {
                    var _entry = labelGroup[_i];
                    console.log('* ' + _entry.name.replace(/ *\([^)]*\) */g, "") + ' / ' + _entry.url);
                }
            });
        });
    }).catch(function (error) {
        console.log(error);
    });
}