const express = require('express');
const server = express();
server.use('/matrix-vr', express.static(`${__dirname}/docs`));

server.listen(3000);
console.log('http://localhost:3000/matrix-vr');
