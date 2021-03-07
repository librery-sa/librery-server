const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    //useMongoClient: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})

mongoose.Promise = global.Promise;

module.exports = mongoose;