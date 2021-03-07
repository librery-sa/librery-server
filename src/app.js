const express = require('express');
const port = process.env.PORT || 3000;
require('./db/db');

const app = express();

app.use(express.json());
require('./controller/authController')(app);
require('./controller/communityController')(app);
require('./controller/userController')(app);
require('./controller/searchController')(app);

const server = app.listen(port);

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
