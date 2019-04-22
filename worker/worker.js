// This worker needs to receive messages from the API and send back the requested info as the response
const axios = require('axios');
const redisConnection = require('./redis-connection');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();
const key = 'userdata';
const gistUrl = 'https://gist.githubusercontent.com/philbarresi/5cf15393d245b38a2d86ce8207d5076c/raw/d529fb474c1af347702ca4d7b992256237fa2819/lab5.json';

bluebird.promisifyAll(redis.RedisClient.prototype);

async function main() {

    const info = await axios.get(gistUrl); // database stored as an array and accessed by info.data

    for (let d in info.data) {
        await client.lpushAsync(key, JSON.stringify(info.data[d]))
    }

    redisConnection.on('get-person', async (data, channel) => {
        try {
            let id = parseInt(data.message) - 1;
            let userInfo = await client.lindexAsync(key, id);
            redisConnection.emit('retrieved-person', JSON.parse(userInfo));
        } catch (e) {
            redisConnection.emit('retrieved-person', {error: e})
        }

    });

    redisConnection.on('get-list', (data, channel) => {
        let message = data.message;
        console.log(message);

        if (message === 'get-list') {
            console.log('read message');
            // console.log(info);
            redisConnection.emit('retrieved-list', info.data);
        }
    });
}

main();


