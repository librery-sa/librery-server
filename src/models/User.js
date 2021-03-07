const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: false,
        default: "",
    },
    friends: [{
        type: String,
    }],
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        select: false,
    },
    saved: [{
        userId: {
            type: String,
        },
        sourceId: {
            type: String,
        }
    }],
    following: [{
        type: String,
    }],
    sources: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        body: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        favorites: [{
            type: String,
        }],
        tags: [{
            type: String,
        }]
    }],
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;