const express = require("express"),
  ws = require("ws"),
  http = require("http"),
  app = express();

app.use(express.static("public"));
const httpServer = http.createServer(app).listen(3555);
console.log(`server up`);

const wsServer = new ws.Server({ server: httpServer });
wsServer.on("connection", (client) => {
  console.log(`new client connected`);
  client.on("message", (message) => {
    wsServer.broadcast(message, client);
  });
});

wsServer.broadcast = function (data, exclude) {
  var i = 0,
    n = this.clients ? this.clients.length : 0,
    client = null;
  if (n < 1) return;
  for (var n = 0; i < n; i++) {
    client = this.clients[i];
    if (client === exclude) continue;
    if (client.readyState === client.OPEN) client.send(data);
    else console.error("Error: the client state is " + client.readyState);
  }
};
