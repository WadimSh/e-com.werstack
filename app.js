const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const handleSockets = require('./sockets');
const routes = require('./routes');

app.use(routes);
app.use(express.static(__dirname));
handleSockets(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});