const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Community = require("../models/Community");
const User = require('../models/User');
const router = express.Router();

/// Return a community [ident]
router.get("/:ident", async (req, res) => {
  try {
    const ident = req.params.ident
    const community = await Community.findOne({ ident: ident });
    if (!community) return res.send({ error: "Community not found" });
    res.send(community);
  } catch (error) {
    res.send({ error: error });
  }
});

/// Return the post [index] from community with identify [ident]
router.get("/:ident/sources/:index", async (req, res) => {
  try {
    const { ident, index } = req.params;
    const community = await Community.findOne({ ident: ident });
    if (!community) return res.send({ error: "Community not found" });
    const post = community.sources[index];
    if (!post) return res.send({ error: "Source not found" });
    res.send(post);
  } catch (error) {
    res.send({ error: error });
  }
});

router.get('/:ident/sources', async (req, res) => {
  try {
    const ident = req.params.ident;
    const sources = await Community.findOne({ ident: ident }).select("sources");
    if (!sources) return res.status(404).send({ error: "Community not found" });
    res.send(sources);
  } catch (error) {
    res.send({ error: error });
  }
});

router.use(authMiddleware);

router.post("/:ident/new", async (req, res) => {
  try {
    const ident = req.params.ident
    const { title, body, tags } = req.body;
    const community = await Community.findOne({ ident: ident });
    if (!community) return res.send({ error: "Community not found" });

    const user = await User.findById(req.userId);
    if (!user) return res.send({ error: "Invalid user" });

    await Community.collection.updateOne(
      { ident: ident },
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
  } catch (error) {
    res.send({ error: error });
  }
});

/// Create a new community
router.post("/new", async (req, res) => {
  try {
    const { ident, name } = req.body
    const owner = req.userId
    if (await Community.findOne({ ident }))
      return res.status(400).send({ error: "Community already exists" });
    const community = await Community.create({ ident: ident, owner: owner, name: name, });
    res.send({
      community
    });
  } catch (error) {
    res.send({ error: error });
  }
});

module.exports = app => app.use('/community', router);