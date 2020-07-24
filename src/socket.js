const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
const { v4: uuidv4 } = require('uuid');
const players = [];

server.on('connection', ws => {
    let id = uuidv4();

    players.push({
        x: Math.floor(Math.random() * 800),
        id: id,
        game: undefined,
        client: ws
    });
    ws.send(JSON.stringify({
        type: 'init',
        players: players
    }));

    console.log(players);

    ws.on('message', msg => {

        players.forEach(player => {
            if (player.client.readyState !== ws && player.client.readyState === WebSocket.OPEN) {
                player.client.send(msg);
            }
        })
    })
});

server.on('close', (ws) => {
    console.log(ws, 'disconnected');
});



























