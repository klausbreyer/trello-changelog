const fetch = require("node-fetch");
const settings = require("./settings");

const url = `https://api.trello.com/1/boards/${settings.board}/cards?key=${settings.key}&token=${settings.token}`;

let result = {};
fetch(url).then(response => {
    response.json().then(json => {
        for (let i = 0, len = json.length; i < len; i++) {

            let entry = json[i];
            if (entry.idList === settings.list) {

                for (let j = 0, len = json.length; j < len; j++) {
                    if (entry.labels[j]) {

                        let label = entry.labels[j] ? entry.labels[j].name : 'sonstige';
                        if (!result[label]) {
                            result[label] = [];
                        }
                        result[label].push({name: entry.name, url: entry.url});
                    }
                }

            }

        }

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
})
    .catch(error => {
        console.log(error);
    });

