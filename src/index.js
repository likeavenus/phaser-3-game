import Phaser from 'phaser';
import './assets/css/styles.scss';

const socket = new WebSocket('ws://localhost:3000');


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

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
    this.add.image(400, 300, 'star');
}

function update ()
{
}



socket.onclose = () => {
    console.log('close')
};

const form = document.querySelector('form');
const list = document.querySelector('#list');
const message = document.querySelector('#msg');

form.addEventListener('submit', e => {
    e.preventDefault();
    socket.send(message.value);
});

socket.onmessage = ws => {
    console.log(ws);
    const liElem = document.createElement('li');
    liElem.innerText = ws.data;
    list.appendChild(liElem);
};

