const express = require('express');
const { ObjectID } = require('mongodb');
const User = require("../models/User");
const authMiddleware = require('../middlewares/auth');
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

router.use(authMiddleware);

router.get('/user/feed', async (req, res) => {
    try {
        const user = await User.findById(req.userId, { _id: false }).select('following');
        let feed = [];
        user.following.forEach(async comm => {
            feed.push(await Community.find({ idend: comm }, { _id: false }).select("sources"));
        });
        feed.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });
        res.send({ feed });
    } catch (e) {
        res.status(400).send({ error: e });
    }
});

module.exports = app => app.use('/search', router);