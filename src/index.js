import Phaser from 'phaser';
import './assets/css/styles.scss';
import { collectStar } from "./helper";

const form = document.querySelector('form');
const list = document.querySelector('#list');
const message = document.querySelector('#msg');

form.addEventListener('submit', e => {
    e.preventDefault();
    socket.send(message.value);
});
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
    player = this.physics.add.sprite(randomX, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    socket = new WebSocket('ws://localhost:3000');

    // socket.onopen = () => {
    //     console.log('Socket is open')
    //
    //     if (socket.readyState === socket.OPEN) {
    //         socket.send(player.x)
    //     }
    // };

    socket.onclose = () => {
        console.log('Connection closed')
    };

    socket.onmessage = ws => {
        // const liElem = document.createElement('li');
        // liElem.innerText = ws.data;
        // list.appendChild(liElem);
        const newVelocity = JSON.parse(ws.data);

        player.body.velocity.x = newVelocity.x;
        player.body.velocity.y = newVelocity.y;
    };
}

function updateVelocity(newVelocity) {
    if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(newVelocity))
    }
}

function update () {

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);

        updateVelocity({
            x: -160,
            y: player.body.velocity.y
        });
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);

        updateVelocity({
            x: 160,
            y: player.body.velocity.y
        });
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');

        updateVelocity({
            x: 0,
            y: player.body.velocity.y
        });
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);

        updateVelocity({
            x: player.body.velocity.x,
            y: -330
        });
    }


}






