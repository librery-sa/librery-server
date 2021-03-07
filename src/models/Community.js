const mongoose = require('mongoose');

const CommunitySchema = mongoose.Schema({
    ident: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    name: {
        type: String,
    },
    owner: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    users: [{
        type: String
    }],
    sources: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        userName: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        body: {
            type: String,
            required: true,
        },
        favorites: [{
            type: String,
        }],
        tags: [{
            type: String,
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Community = mongoose.model('Community', CommunitySchema);

module.exports = Community;