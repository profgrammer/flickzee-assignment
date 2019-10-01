const es = require('elasticsearch');
const fs = require('fs');

const esClient = new es.Client({
    hosts: ['https://elastic:MSODIqdfVta6KZoUyFfuZ7kK@04a37bb48c974869987510acc4352e78.ap-southeast-1.aws.found.io:9243']
});

esClient.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!', error);
    } else {
        console.log('Everything is ok');
    }
});

function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
        bulkBody.push({
            index: {
                _index: index,
            }
        })

        bulkBody.push(item);
    })

    esClient.bulk({body: bulkBody})
    .then(response => {
        let errorCount = 0;
        response.items.forEach(item => {
            if(item.index && item.index.error) {
                console.log(`${++errorCount} - ${item.index.error}`);
            }
        })
        console.log(`successfully added ${data.length - errorCount} items`);
    }).catch(err => console.log(`in catch - ${err}`));
}

function test() {
    // const moviesRaw = fs.readFileSync('csvjson.json');
    // const movies = JSON.parse(moviesRaw);
    // console.log(`parsed ${movies.length} items from JSON`);
    // bulkIndex('movies', 'movie', movies);
    // console.log(movies[0]);
    esClient.cat.indices({v: true})
    .then(console.log)
    .catch(err => console.log(err));
}

test();
