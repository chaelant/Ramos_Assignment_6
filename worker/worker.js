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
    // console.log(info.data);

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

    redisConnection.on('get-list', async (data, channel) => {
        let message = data.message;

        if (message === 'get-list') {
            // console.log('read message');
            let personList = await client.lrangeAsync(key, 0, -1);
            const parsedPersonList = personList.map(x => JSON.parse(x));
            redisConnection.emit('retrieved-list', parsedPersonList);
        }
    });

    redisConnection.on('add-person', async (data, channel) => {
        try {
            let message = data.message;
            let currentLength = await client.llenAsync(key);
            // console.log(currentLength);
            message['id'] = currentLength + 1;
            await client.lpushAsync(key, JSON.stringify(message));
            // console.log(message);
            let newLength = await client.llenAsync(key);
            // console.log(newLength);
            redisConnection.emit('person-added', {})
        } catch (e) {
            redisConnection.emit('person-added', {error: e})
        }

    });

    redisConnection.on('delete-person', async (data, channel) => {
        try {
            let id = parseInt(data.message);
            // console.log(id);
            const targetData = await client.lindexAsync(key, id);
            // console.log(targetData);
            await client.lremAsync(key, 0, targetData);
            let personList = await client.lrangeAsync(key, 0, -1);
            const parsedPersonList = personList.map(x => JSON.parse(x));
            redisConnection.emit('person-deleted', parsedPersonList);
        } catch (e) {
            redisConnection.emit('person-deleted', {error: e})
        }
    })
}

main();


