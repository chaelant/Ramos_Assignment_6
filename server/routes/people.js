const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    res.sendStatus(200);
});

router.post('/', async (req, res) => {
    res.sendStatus(200);
});

router.delete('/:id', async(req, res) => {
    res.sendStatus(200)
});

router.put('/:id', async(req, res) => {
    res.sendStatus(200)
});

module.exports = router;
