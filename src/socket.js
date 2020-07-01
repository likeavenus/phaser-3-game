const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = [];

server.on('connection', ws => {
    let id = uuidv4();

    players.push({
        x: Math.floor(Math.random() * 800),
        id: id,
        client: ws
    });


    ws.on('message', msg => {
        players.forEach(player => {
            player.client.send(msg);
        })

        // server.clients.forEach(client => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         players.forEach(player => {
        //             if (player.id !== client.id) {
        //
        //                 client.send(msg);
        //             }
        //         })
        //
        //     }
        // })
    })
});



























