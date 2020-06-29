const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = new Set();

server.on('connection', ws => {
    ws.id = uuidv4()
    players.add(ws.id);

    console.log(players);

    ws.on('message', msg => {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg)
            }
        })
    })
});
