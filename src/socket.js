const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = {};

server.on('connection', ws => {
    ws.id = uuidv4();

    players[ws.id] = {
        x: Math.random() * 800
    };

    server.on('open', () => {
        ws.send('== OPEN ==')
    })

    ws.on('message', msg => {
        console.log(msg)
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg)
            }
        })
    })
});
