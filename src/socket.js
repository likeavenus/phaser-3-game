const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = [];

server.on('connection', ws => {
    ws.id = uuidv4();

    // players[ws.id] = {
    //     x: Math.random() * 800,
    //     id: ws.id
    // };
    players.push({
        x: Math.floor(Math.random() * 800),
        id: ws.id
    });


    ws.on('message', msg => {

        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                players.forEach(player => {
                    if (player.id !== client.id) {
                        console.log(player.id !== client.id)
                        client.send(msg);
                    }
                })

            }
        })
    })
});



























