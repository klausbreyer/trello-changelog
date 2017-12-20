const fetch = require("node-fetch");
const settings = require("./settings");

const inquirer = require('inquirer');


fetch(`https://api.trello.com/1/members/me/boards?key=${settings.key}&token=${settings.token}`).then(response => {
    response.json().then(json => {
        const boards = filterBoardsFromJson(json);

        inquirer.prompt({
            type: 'list',
            name: 'board',
            message: "Board?",
            choices: boards
        }).then(answers => {
            const board = answers.board;
            fetch(`https://api.trello.com/1/boards/${board}/lists?key=${settings.key}&token=${settings.token}`).then(response => {
                response.json().then(json => {

                    const lists = filterListsFromJson(json);

                    inquirer.prompt({
                        type: 'list',
                        name: 'list',
                        message: 'List?',
                        choices: lists
                    })
                        .then(answers => {
                            const list = answers.list;

                            fetch(`https://api.trello.com/1/boards/${board}/cards?key=${settings.key}&token=${settings.token}`).then(response => {
                                response.json().then(json => {

                                    let result = filterCardsFromJson(json, list);

                                    Object.keys(result).forEach(function (element, key, _array) {
                                        let resultSet = result[element];
                                        console.log('');
                                        console.log(`${element}:`);
                                        // console.log(resultSet);
                                        for (let i = 0, len = resultSet.length; i < len; i++) {
                                            let entry = resultSet[i];
                                            console.log(`* ${entry.name.replace(/ *\([^)]*\) */g, "")} / ${entry.url}`);

                                        }
                                    });
                                });
                            }).catch(error => {
                                console.log(error);
                            });
                        });
                });
            }).catch(error => {
                console.log(error);
            });
        });
    });
}).catch(error => {
    console.log(error);
});


function filterBoardsFromJson(json) {
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
    return boards;

}

function filterListsFromJson(json) {
    let lists = [];
    for (let i = 0, len = json.length; i < len; i++) {
        let entry = json[i];
        lists.push({
            name: entry.name,
            value: entry.id
        })
    }
    return lists;
}

function filterCardsFromJson(json, list) {
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
    return cards;
}