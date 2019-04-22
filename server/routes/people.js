const express = require('express');
const redisConnection = require('../../worker/redis-connection');
const router = express.Router();

router.get('/', async (req, res) => {
    redisConnection.emit('get-list', {
        message: 'get-list'
    });

    redisConnection.on('retrieved-list', (data, channel) => {
        console.log('got message back from worker');
        console.log(data);
        if (!res.headersSent) {
            res.render('pages/userlist', {personInfo: data});
        }
    });
});

// This route will publish a message to request a person from the worker,
// and render JSON of the person (or of an error, should once occur)
router.get('/:id', async (req, res) => {

    redisConnection.emit('get-person', {
        message: req.params.id
    });

    redisConnection.on('retrieved-person', (data, channel) => {
        console.log('got data back from worker');
        // console.log(data);
        if (!res.headersSent) {
            res.send(data);
        }
    });

});

// This route will publish a message to request that the worker creates a person,
// and render JSON of the person created (or of an error, should once occur)
router.post('/', async (req, res) => {
    res.sendStatus(200);
});


// This route will publish a message to request that the worker deletes a person,
// and render JSON stating that the operation completed (or of an error, should once occur)
router.delete('/:id', async(req, res) => {
    res.sendStatus(200)
});

// This route will publish a message to request that the worker updates a person,
// and render JSON of the person updated (or of an error, should once occur)
router.put('/:id', async(req, res) => {
    res.sendStatus(200)
});

module.exports = router;
