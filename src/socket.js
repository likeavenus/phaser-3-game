const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = {};

server.on('connection', ws => {
    ws.id = uuidv4();

    players[ws.id] = {
        x: Math.random() * 800
    };


    ws.send([players], {
        binary: false,
        fin: false
    });

    ws.on('message', msg => {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        })
    })
});
