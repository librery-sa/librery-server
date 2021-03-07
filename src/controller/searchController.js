const express = require('express');
const { ObjectID } = require('mongodb');
const User = require("../models/User");
const Community = require('../models/Community');
const router = express.Router();

router.get("/community", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.send({});
    const community = await Community.find({
        name: { '$regex': new RegExp("^" + name, "i") }
    }).select("_id name");
    res.send({ community });
});

router.get('/community/:id', async (req, res) => {
    try {
        const id = req.params.id
        const community = await Community.findById(id).select("ident");
        if (!community) return res.status(404).send({ error: "Community not found" });
        res.send(community);
    } catch (e) {
        res.status(404).send({ error: "Failed to find community" });
    }
});

module.exports = app => app.use('/search', router);