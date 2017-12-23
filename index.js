const fetch = require("node-fetch");

const fs = require('fs');

const inquirer = require('inquirer');


let settings = null;
try {
     settings = require("./settings.json");
    fetchBoards(settings);

}
catch (e) {
    var questions = [
        {
            type: 'input',
            name: 'key',
            message: "App Key:",
            validate: function (value) {
                return value.length === 32;

            }
        },
        {
            type: 'input',
            name: 'token',
            message: "User token:",
            validate: function (value) {
                return value.length === 64;

            }
        }
    ];
    console.log('You need an trello app key as well as a user token. You can grab both of them here: https://trello.com/app-key')
    inquirer.prompt(questions).then(answers => {
        settings = answers;
        fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), 'utf-8', null);
        fetchBoards();
    });

}


function fetchBoards() {
    fetch(`https://api.trello.com/1/members/me/boards?key=${settings.key}&token=${settings.token}`).then(response => {
        response.json().then(json => {
            let boards = [];
            for (let i = 0, len = json.length; i < len; i++) {
                let entry = json[i];
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
            }).then(answers => {
                const board = answers.board;
                fetchLists(board);
            });
        });
    }).catch(error => {
        console.log(error);
    });
}

function fetchLists(board) {
    fetch(`https://api.trello.com/1/boards/${board}/lists?key=${settings.key}&token=${settings.token}`).then(response => {
        response.json().then(json => {

            let lists = [];
            for (let i = 0, len = json.length; i < len; i++) {
                let entry = json[i];
                lists.push({
                    name: entry.name,
                    value: entry.id
                })
            }

            inquirer.prompt({
                type: 'list',
                name: 'list',
                message: 'List?',
                choices: lists
            })
                .then(answers => {
                    const list = answers.list;

                    fetchCards(board, list);
                });
        });
    }).catch(error => {
        console.log(error);
    });
}

function fetchCards(board, list) {

    fetch(`https://api.trello.com/1/boards/${board}/cards?key=${settings.key}&token=${settings.token}`).then(response => {
        response.json().then(json => {
            let cards = {};
            for (let i = 0, len = json.length; i < len; i++) {

                let entry = json[i];
                if (entry.idList === list) {
                    for (let j = 0, len = json.length; j < len; j++) {
                        if (entry.labels[j]) {
                            let label = entry.labels[j] ? entry.labels[j].name : 'sonstige';
                            if (!cards[label]) {
                                cards[label] = [];
                            }
                            cards[label].push({name: entry.name, url: entry.shortUrl});
                        }
                    }
                }
            }

            Object.keys(cards).forEach(function (element, key, _array) {
                let labelGroup = cards[element];
                console.log('');
                console.log(`${element}:`);
                // console.log(resultSet);
                for (let i = 0, len = labelGroup.length; i < len; i++) {
                    let entry = labelGroup[i];
                    console.log(`* ${entry.name.replace(/ *\([^)]*\) */g, "")} / ${entry.url}`);

                }
            });
        });
    }).catch(error => {
        console.log(error);
    });
}
