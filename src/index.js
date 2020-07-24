import Phaser from 'phaser';
import './assets/css/styles.scss';
import { collectStar } from "./helper";
let socket;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);
let platforms;
let player;
let cursors;
let stars;

let players = [];
let data;

function preload () {
    this.load.image('sky', 'src/assets/img/sky.png');
    this.load.image('ground', 'src/assets/img/platform.png');
    this.load.image('star', 'src/assets/img/star.png');
    this.load.image('bomb', 'src/assets/img/bomb.png');
    this.load.spritesheet('dude',
        'src/assets/img/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}


function create () {

    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    const randomX = Math.floor(Math.random() * 800);


    // player = this.physics.add.sprite(randomX, 450, 'dude');
    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    // this.physics.add.collider(player, platforms);

    // this.physics.add.overlap(player, stars, collectStar, null, this);
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        console.log('Socket is open')
    };

    socket.onclose = () => {
        console.log('Connection closed')
    };

    window.addEventListener('onbeforeunload', () => {
        socket.close(1000, 'Player is offline');
    });

    socket.onmessage = ws => {

        console.log(JSON.parse(ws.data))
        data = JSON.parse(ws.data);

        if (data.type === 'init') {
            players = data.players;
            players.forEach(player => {
                updatePlayer(player, this)
            })
        }

        if (data.type === 'update_player') {

            players.forEach(player => {
                if (player.id === data.player.id) {
                    updatePlayer(data.player, this);
                }
            })
        }
    };
}

function updatePlayer(player, context) {
    player.game = context.physics.add.sprite(player.x, 450, 'dude');
    player.game.setBounce(0.2);
    player.game.setCollideWorldBounds(true);
    context.physics.add.collider(player.game, platforms);

    context.physics.add.overlap(player.game, stars, collectStar, null, context);
}

function updateData(newData) {
    if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({
            type: 'update_player',
            player: newData
        }))
    }
}

function update () {
    if (players.length) {
        if (cursors.left.isDown)
        {
            players[0].game.setVelocityX(-160);

            players[0].game.anims.play('left', true);

            updateData(players[0]);
        }
        else if (cursors.right.isDown)
        {
            players[0].game.setVelocityX(160);

            players[0].game.anims.play('right', true);

            updateData(players[0]);
        }
        else
        {
            players[0].game.setVelocityX(0);

            players[0].game.anims.play('turn');

            // updateData(players[0]);
        }

        if (cursors.up.isDown && players[0].game.body.touching.down)
        {
            players[0].game.setVelocityY(-330);

            updateData(players[0]);
        }
    }
}






