const es = require('elasticsearch');
const express = require('express');
const app = express();
const bp = require('body-parser');


// const esClient = new es.Client({
//     host: 'localhost:9200',
//     log: 'error'
// });

console.log(process.env.USERNAME)

const esClient = new es.Client({
  hosts: [`https://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.ENDPOINT}:${process.env.PORT}`]
});

app.use(bp.json());

function search(index, body) {
    return esClient.search({index, body});
}



app.get('/search', (req, res) => {
    let body = {
        size: 10,
        from: 0,
        "query": {
            "match": {
              "MovieName": {
                "query": req.query.q,
                "fuzziness": 5,
                "prefix_length": 0
              }
            }
          }
    }
    // const q = req.query.q;
    // q.split(' ').forEach(item => {
    //     body.query.span_near.clauses.push({
    //         "span_multi": {
    //             "match": {
    //             "fuzzy": {
    //                 "MovieName": {
    //                 "fuzziness": 3,
    //                 "value": item
    //                 }
    //             }
    //             }
    //         }
    //     })
    // })
    search('movies', body)
    .then(results => {
        console.log(`found ${results.hits.total} items in ${results.took} ms`);
        res.status(200).json(results.hits.hits);
    })
})

app.listen(3000, () => console.log('listening on port 3000'));


