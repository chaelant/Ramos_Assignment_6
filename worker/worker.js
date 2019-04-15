// This worker needs to receive messages from the API and send back the requested info as the response
const redisConnection = require('./redis-connection');
const axios = require('axios');

// On run, turn this into a main function that downloads the data
// Then, we're going to export functions that leverage the redisConnection methods
// That way, I can use async/await
// Because LORDT .then() syntax is annoying #SpoiledByECMA9 *shrugs*

const gistUrl = 'https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json';

const info = axios.get(gistUrl).then(downloaded => {
    return downloaded;
});

redisConnection.on("send-message", (data, channel) => {
    let message = data.message;
    console.log('\n\n\n========');
    console.log('Message received:');
    console.log(message);
    console.log(JSON.stringify(data));
    console.log('========\n\n\n');
});

redisConnection.on('get-list', (data, channel) => {
    let message = data.message;
    console.log(message);

    if (message === 'get-list') {
        console.log('read message');
        console.log(info);
        redisConnection.emit('retrieved-list', info)
    }
});

