const express = require('express');
const { ObjectID } = require('mongodb');
const authMiddleware = require('../middlewares/auth');
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
    const { name } = req.body;
    const users = await User.find({
        name: { '$regex': new RegExp("^" + name, "i") }
    }).select("_id name");
    res.send({ users });
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.send(user);
});

router.use(authMiddleware);

router.post("/sources/new", async (req, res) => {
    const user = await User.findById(req.userId);
    const { title, body, tags } = req.body;

    if (!user) return res.send({ error: "User not found" });
    User.collection.updateOne(
        { "_id": ObjectID(req.userId) },
        {
            $push: {
                sources: {
                    title: title,
                    body: body,
                    userName: user.name,
                    tags: tags,
                }
            }
        });
    res.send({ ok: true });
});

router.get('/feed', async (req, res) => {
    const user = await User.findById(req.userId).select("+sources");

    if (!user) return res.send({ error: "User not found" });

    res.send({ sources: user.sources });
});

module.exports = app => app.use('/user', router);