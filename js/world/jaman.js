import * as THREE from '/three-patch/build/three.module.js'

import SCENE from './three/SCENE.js'
import CAMERA from './three/CAMERA.js'
import RENDERER from './three/RENDERER.js'

import CONTROLS from './ui/CONTROLS.js'



const map_img = document.createElement('img')
map_img.src = '/resource/media/textures/terraria_test2.png'


let users = {};

function emitAction(type) {
    if(!users.user || !users.user.id){
        return;
    }
    const time = Date.now();
    socket.emit('action', {
        id: users.user.id,
        type: type,
        actionTime: time,
        prevActionTime: HERO_MESH.userData.prevActionTime,
        vx: HERO_MESH.userData.vx,//unused
        vy: HERO_MESH.userData.vy,//unused
        tx: HERO_MESH.userData.tx,//unused
        ty: HERO_MESH.userData.ty,//unused
        x: HERO_MESH.userData.x,
        y: HERO_MESH.userData.y
    });
    HERO_MESH.userData.prevActionTime = time;
}

// const MOVE_SPEED = 1;
let PIXEL_SIZE = 10;
let CANVAS_W = 64 * PIXEL_SIZE;
let CANVAS_H = 128 * PIXEL_SIZE;
// let GAME_W = 800;
// let GAME_H = 600;
const FLOOR_COLOR = "#cccccc";
const WALL_COLOR = "#333333";
const HERO_COLOR = "#eeff33";


const colors = [
    'transparent',
    'rgb(99,199,77)',
    'rgb(38,92,66)',
    'rgb(25,60,62)',
    'rgb(115,62,57)',
    'rgb(181,80,136)',
    'rgb(104,56,108)',
    'rgb(18,78,137)',
    
    'rgb(190,74,47)',
    'rgb(24,20,37)',
    'rgb(90,105,136)',
    'rgb(255,255,255)',
    'rgb(139,155,180)',
    'rgb(162,38,51)',
    'rgb(246,117,122)',
    'rgb(254,231,97)',
    'rgb(234,212,170)',
    'rgb(194,133,105)',
    'rgb(232,183,150)'
];
const wallColors = {
    'rgb(99,199,77)': 1,
    'rgb(38,92,66)': 1,
    'rgb(25,60,62)': 1,
    'rgb(115,62,57)': 1,
    'rgb(181,80,136)': 1,
    'rgb(104,56,108)': 1,
    'rgb(18,78,137)': 1
};

let GRAVITY = 0.09;

// const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer();
// renderer.domElement.style.position = "fixed";
// renderer.domElement.style.top = "0px";
// renderer.domElement.style.left = "0px";
// renderer.domElement.style.zIndex = "111";
// renderer.setSize( GAME_W, GAME_H );
// document.body.appendChild( renderer.domElement ); 
CAMERA.position.x = 0;
CAMERA.position.y = 0;
CAMERA.position.z = 18;



const WORLD_GROUP = new THREE.Group();
SCENE.add(WORLD_GROUP);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({ color: HERO_COLOR });
const HERO_MESH = new THREE.Mesh( geometry, material );
// HERO_MESH.userData.x = (CANVAS_W/2) - 90;
// HERO_MESH.userData.y = CANVAS_H - (CANVAS_H/8) + 50;
HERO_MESH.userData.x = (CANVAS_W/2) - 30;
HERO_MESH.userData.y = CANVAS_H - (CANVAS_H/8) - 20;
HERO_MESH.userData.jumpPower = 4;
HERO_MESH.userData.ax = 0;
HERO_MESH.userData.ay = GRAVITY;
HERO_MESH.userData.vx = 0;
HERO_MESH.userData.vy = 0;
SCENE.add( HERO_MESH );

// bit canvas
const canvas = document.createElement('canvas');
// const canvas = RENDERER.domElement
// document.querySelector('canvas')
canvas.style.position = "fixed";
canvas.style.left = "0px";
canvas.style.bottom = "0px";
canvas.style.zIndex = "1";
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// backup map canvas
const collisionCanvas = document.createElement('canvas');
// document.body.appendChild(collisionCanvas);
const collisionCtx = collisionCanvas.getContext('2d');
// collisionCtx.drawImage(canvas, 0, 0, CANVAS_W, CANVAS_H);

// player canvas
const heroCanvas = document.createElement('canvas');
const heroCtx = heroCanvas.getContext('2d');




function animate() {
    playerupdate();
    requestAnimationFrame( animate );
    RENDERER.render( SCENE, CAMERA );
    CONTROLS.update();
    WORLD_GROUP.position.set(
        -(HERO_MESH.userData.x / PIXEL_SIZE),
        -(CANVAS_H/PIXEL_SIZE)+(HERO_MESH.userData.y / PIXEL_SIZE)-0.1,
        -1,
    );
    Object.keys(users).forEach(uid=>{
        const user = users[uid];
        
        // console.log('user === ',user);
    })
}
window.onload = () => {

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = WALL_COLOR;

    collisionCanvas.width = CANVAS_W;
    collisionCanvas.height = CANVAS_H;

    heroCanvas.width = CANVAS_W;
    heroCanvas.height = CANVAS_H;
    heroCtx.fillStyle = "yellow";
    heroCtx.fillRect(HERO_MESH.userData.x, HERO_MESH.userData.y, PIXEL_SIZE, PIXEL_SIZE);
    ctx.drawImage(heroCanvas, 0, 0);
    const colorZ = {
        'rgb(99,199,77)': 1,
        'rgb(38,92,66)': 1,
        'rgb(25,60,62)': 1,
        'rgb(115,62,57)': 1,
        'rgb(104,56,108)': 1,
        'rgb(190,74,47)': 1,
        'rgb(24,20,37)': 1,
        'rgb(255,255,255)': 1,
        'rgb(139,155,180)': 1,
        'rgb(162,38,51)': 1,
        'rgb(246,117,122)': 1,
        
        'rgb(90,105,136)': 0,
        'rgb(181,80,136)': 0,
        'rgb(18,78,137)': 0,
        'rgb(254,231,97)': 0,
        'rgb(234,212,170)': 0,
        'rgb(194,133,105)': 0,
        'rgb(232,183,150)': 0
    };
    const colorArr = Object.keys(colorZ);
    const zArr = colorArr.map(k=>colorZ[k]);
    const rgbArr = colorArr.map(n=>n.split("(")[1].replace(")","").split(",").map(Number));

    drawWalls(map_img, wallColors);

    const mapImageData = imageToImageData(map_img);
    console.log('mapImageData === ',mapImageData);
    const COLORS = colorArr.map(c=>new THREE.Color(c));
    console.log('COLORS === ',COLORS);
    const plen = COLORS.length;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({color:"#999"});
    const material = new THREE.MeshBasicMaterial();
    const instancedMesh = new THREE.InstancedMesh(
        geometry,
        material,
        mapImageData.data.length/4
    );
    const temp = new THREE.Object3D();
    const colorIdxCache = {};
    const zCache = {};
    const w = mapImageData.width;
    const h = mapImageData.height;
    for(let i = 0; i < mapImageData.data.length;i+=4) {
        let _i = i/4;
        const x = _i%w;
        const y = h - Math.floor(_i/w);
        const r = mapImageData.data[i];
        if(!colorIdxCache[r]){
            let idx = 0;
            for(let rgbIdx = 0; rgbIdx < rgbArr.length;rgbIdx++) {
                const v = rgbArr[rgbIdx][0];
                if(r === rgbArr[rgbIdx][0]){
                    colorIdxCache[r] = COLORS[rgbIdx];
                    zCache[r] = rgbIdx;
                    break;
                }
            }
            COLORS.find(c=>{
                const n = Math.floor(c.r*255);
                // console.log('n === ',n, r);
                return n > (r-25) && n < (r+5)
            });
        }
        const z = zArr[zCache[r]];
        temp.position.x = x;
        temp.position.y = y;
        temp.position.z = z;
        temp.updateMatrix();
        instancedMesh.setMatrixAt(_i, temp.matrix);
        instancedMesh.setColorAt(_i, colorIdxCache[r]);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.instanceColor.needsUpdate = true;
    WORLD_GROUP.add(instancedMesh);
    // WORLD_GROUP.position.x = (CANVAS_W / PIXEL_SIZE)/2;
    // WORLD_GROUP.position.z = (CANVAS_H / PIXEL_SIZE)/2;

    animate();
}
function getTileMaterials(tileDataArr,idxArr) {
    
    return idxArr.map(i=>{
        const canvas = document.createElement('canvas');
        const scaledImageData = scaleImageData(tileDataArr[i], 8);
        const w = canvas.width = scaledImageData.width;
        const h = canvas.height = scaledImageData.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(scaledImageData, 0, 0);
        return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas)});
    })
}








const keyboard = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    KEYBOARD_W: 87,
    KEYBOARD_A: 65,
    KEYBOARD_S: 83,
    KEYBOARD_D: 68,
    KEYBOARD_SPACE: 32,
    LEFT_STICK: "L_STICK",
    UP_STICK: "U_STICK",
    RIGHT_STICK: "R_STICK",
    DOWN_STICK: "D_STICK",
    LEFT_PAD: "L_PAD",
    UP_PAD: "U_PAD",
    RIGHT_PAD: "R_PAD",
    DOWN_PAD: "D_PAD",
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        console.log('event === ',event);
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('gamepadconnected', (e) => {
    console.log("Gamepad connected");
    window.HERO_GAMEPAD_IDX = e.gamepad.index;
    console.log('window.HERO_GAMEPAD_IDX === ',window.HERO_GAMEPAD_IDX);
});

setInterval(() => {
    window.HERO_GAMEPAD = navigator.getGamepads()[window.HERO_GAMEPAD_IDX];
    if(window.HERO_GAMEPAD !== undefined) {
        let isMoving = false;
        if(window.HERO_GAMEPAD.axes) {
            keyboard._pressed[keyboard.LEFT_STICK] = window.HERO_GAMEPAD.axes[0] < -0.1;
            keyboard._pressed[keyboard.RIGHT_STICK] = window.HERO_GAMEPAD.axes[0] > 0.1;
            keyboard._pressed[keyboard.UP_STICK] = window.HERO_GAMEPAD.axes[1] < -0.1;
            keyboard._pressed[keyboard.DOWN_STICK] = window.HERO_GAMEPAD.axes[1] > 0.1;
            isMoving = keyboard._pressed[keyboard.LEFT_STICK]
                || keyboard._pressed[keyboard.RIGHT_STICK]
                || keyboard._pressed[keyboard.UP_STICK]
                || keyboard._pressed[keyboard.DOWN_STICK]
                ;
        }
        if(isMoving) {
            playerupdate();
        }
    }
}, 100);

function playerupdate() {
    function maybeJump() {
        if(!HERO_MESH.userData.isJumping) {
            HERO_MESH.userData.vy = -HERO_MESH.userData.jumpPower;
            HERO_MESH.userData.isJumping = true;
            emitAction("jump");
        }
    }
    if(window.HERO_GAMEPAD) {
        HERO_GAMEPAD.buttons.map(e => e.pressed).forEach((isPressed, buttonIndex) => {
            if(isPressed) {
                // console.log(`Button ${buttonIndex} is pressed`);
                if(buttonIndex === 0) {
                    // xbox one controller "A" button
                    maybeJump();
                }
                if(buttonIndex === 1) {
                    // xbox one controller "B" button
                }
                if(buttonIndex === 2) {
                    // xbox one controller "X" button
                }
                if(buttonIndex === 3) {
                    // xbox one controller "Y" button
                }
                if(buttonIndex === 4) {
                    // xbox one controller "LB" button
                }
                if(buttonIndex === 5) {
                    // xbox one controller "RB" button
                }
                if(buttonIndex === 6) {
                    // xbox one controller "LT" button
                }
                if(buttonIndex === 7) {
                    // xbox one controller "RT" button
                }
                if(buttonIndex === 8) {
                    // xbox one controller "Left Start" button
                }
                if(buttonIndex === 9) {
                    // xbox one controller "Right Start" button
                }
                if(buttonIndex === 10) {
                    // xbox one controller "Left Stick Button" button
                }
                if(buttonIndex === 11) {
                    // xbox one controller "Right Stick Button" button
                }
                if(buttonIndex === 12) {
                    // d-pad up
                    keyboard._pressed[keyboard.UP_PAD] = true;
                }
                if(buttonIndex === 13) {
                    // d-pad down
                    keyboard._pressed[keyboard.DOWN_PAD] = true;
                }
                if(buttonIndex === 14) {
                    // d-pad left
                    keyboard._pressed[keyboard.LEFT_PAD] = true;
                }
                if(buttonIndex === 15) {
                    // d-pad right
                    keyboard._pressed[keyboard.RIGHT_PAD] = true;
                }
            } else {
                if(buttonIndex === 12) {
                    // d-pad up
                    keyboard._pressed[keyboard.UP_PAD] = false;
                }
                if(buttonIndex === 13) {
                    // d-pad down
                    keyboard._pressed[keyboard.DOWN_PAD] = false;
                }
                if(buttonIndex === 14) {
                    // d-pad left
                    keyboard._pressed[keyboard.LEFT_PAD] = false;
                }
                if(buttonIndex === 15) {
                    // d-pad right
                    keyboard._pressed[keyboard.RIGHT_PAD] = false;
                }
            }
        });
    }
    if(keyboard.isDown(keyboard.KEYBOARD_SPACE)) {
        maybeJump(); 
    }
    const pressingLeft = (
            keyboard.isDown(keyboard.LEFT)
            || keyboard.isDown(keyboard.KEYBOARD_A)
            || keyboard.isDown(keyboard.LEFT_STICK)
            || keyboard.isDown(keyboard.LEFT_PAD)
        )
        && HERO_MESH.userData.x > 0
        // && wontHitAnything(HERO_MESH.userData.vx, 0)
        ;
    const pressingRight = (
            keyboard.isDown(keyboard.RIGHT)
            || keyboard.isDown(keyboard.KEYBOARD_D)
            || keyboard.isDown(keyboard.RIGHT_STICK)
            || keyboard.isDown(keyboard.RIGHT_PAD)
        )
        && HERO_MESH.userData.x < CANVAS_W - PIXEL_SIZE
        // && wontHitAnything(HERO_MESH.userData.vx, 0)
        ;
    const pressingUp = (
            keyboard.isDown(keyboard.UP)
            || keyboard.isDown(keyboard.KEYBOARD_W)
            || keyboard.isDown(keyboard.UP_STICK)
            || keyboard.isDown(keyboard.UP_PAD)
        ) 
        && HERO_MESH.userData.y > 0 
        // && wontHitAnything(0, HERO_MESH.userData.vy)
        ;
    const pressingDown = (
            keyboard.isDown(keyboard.DOWN)
            || keyboard.isDown(keyboard.KEYBOARD_S)
            || keyboard.isDown(keyboard.DOWN_STICK)
            || keyboard.isDown(keyboard.DOWN_PAD)
        )
        && HERO_MESH.userData.y < CANVAS_H - PIXEL_SIZE
        // && wontHitAnything(0, HERO_MESH.userData.vy)
        ;
    let directionChange = false;
    if (pressingLeft) {
        let dx = window?.HERO_GAMEPAD?.axes[0];
        if(!dx || dx > -0.1)dx = -1;
        if(dx !== HERO_MESH.userData.vx)directionChange = true;
        HERO_MESH.userData.vx = dx;
    }
    if (pressingRight) {
        let dx = window?.HERO_GAMEPAD?.axes[0];
        if(!dx || dx < 0.1)dx = 1;
        if(dx !== HERO_MESH.userData.vx)directionChange = true;
        HERO_MESH.userData.vx = dx;
    }
    if (pressingUp) {
        let dy = window?.HERO_GAMEPAD?.axes[1];
        if(!dy || dy > -0.1)dy = -1;
        if(dy !== HERO_MESH.userData.vy)directionChange = true;
        // HERO_MESH.userData.vy = dy;
    }
    if (pressingDown) {
        let dy = window?.HERO_GAMEPAD?.axes[1];
        if(!dy || dy < 0.1)dy = 1;
        if(dy !== HERO_MESH.userData.vy)directionChange = true;
        HERO_MESH.userData.vy = dy;
    }
    if(!pressingLeft && !pressingRight) {
        HERO_MESH.userData.vx = 0;
    }

    // HERO_MESH.userData.vy += GRAVITY;
    HERO_MESH.userData.vy += HERO_MESH.userData.ay;

    if(HERO_MESH.userData.vx || HERO_MESH.userData.vy) {
        
        const wontHitX = wontHitAnything(HERO_MESH.userData.vx, 0);
        const wontHitY = wontHitAnything(0, HERO_MESH.userData.vy);
        const wontHitXY = wontHitAnything(HERO_MESH.userData.vx, HERO_MESH.userData.vy);
        if(wontHitXY) {
            updatepos();
        } else {
            if(!wontHitX){
                HERO_MESH.userData.vx = 0;
            }
            if(!wontHitY){
                HERO_MESH.userData.vy = 0;
                HERO_MESH.userData.isJumping = false;
            }
            if(wontHitX && wontHitY){
                HERO_MESH.userData.vx = 0;
                HERO_MESH.userData.vy = 0;
            } else {
                updatepos();
            }
        }
        if(!wontHitAnything(0,0)) {
            if(typeof HERO_MESH.userData.prevX !== "undefined")HERO_MESH.userData.x = HERO_MESH.userData.prevX;
            if(typeof HERO_MESH.userData.prevY !== "undefined")HERO_MESH.userData.y = HERO_MESH.userData.prevY;
        }
    }
    if(directionChange){
        emitAction("move");
    }
    // console.log('HERO_MESH.userData.vy === ', pressingUp, HERO_MESH.userData.vy);
}

window.addEventListener('keyup', function (event) {
    keyboard.onKeyup(event);
}, false);
window.addEventListener('keydown', function (event) {
    keyboard.onKeydown(event);
}, false);

function drawWalls(img, wallColors = {}) {
    const colorMap = {"transparent":0};
    const ruleMap = {};
    const ruleArr = [...Array(img.height)].map(() => {
        return [...Array(img.width)].map(() => 0);
    });
    const imgData = imageToImageData(img);
    ruleArr.forEach((row,y) => {//perf
        row.forEach((v,x) => {
            const i = ((x%img.width) * 4) + Math.floor(y * img.width * 4);//perf
            const r = imgData.data[i];
            const g = imgData.data[i+1];
            const b = imgData.data[i+2];
            const a = imgData.data[i+3];
            let key = `rgb(${r},${g},${b})`;//perf
            if(a === 0) {
                key = "transparent";
            }
            if(typeof colorMap[key] === "undefined"){
                colorMap[key] = Object.keys(colorMap).length;//perf
            }
            ruleArr[y][x] = colorMap[key];
        });
    });
    const mapColor = Object.keys(colorMap);
    console.log('colorMap === ',colorMap);
    console.log('ruleArr === ',ruleArr);
    console.log('mapColor === ',mapColor);
    
    ruleArr.forEach((row,y) => {//perf
        row.forEach((v,x) => {
            if(v === 0)return;//perf?

            if(wallColors[mapColor[v]]) {
                collisionCtx.fillStyle = mapColor[v];//perf
                collisionCtx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        });
    });
    // document.body.appendChild(collisionCanvas);
    ctx.drawImage(collisionCanvas,0,0);
}

updatepos();

function wontHitAnything(dx, dy) {
    const imageData = collisionCtx.getImageData(HERO_MESH.userData.x + dx, HERO_MESH.userData.y + dy, PIXEL_SIZE, PIXEL_SIZE);
    const len = imageData.data.length;
    let wontHit = true;
    for(let i = 3; i < len;i+=4) {
        if(imageData.data[i] > 0){
            wontHit = false;
            break;
        }
    }
    if(wontHit && dx === 0 && dy === 0) {
        HERO_MESH.userData.prevX = HERO_MESH.userData.x;
        HERO_MESH.userData.prevY = HERO_MESH.userData.y;
    }
    return wontHit;
}

function updatepos() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = FLOOR_COLOR;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.drawImage(collisionCanvas, 0, 0);
    heroCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    HERO_MESH.userData.x += HERO_MESH.userData.vx;
    HERO_MESH.userData.y += HERO_MESH.userData.vy;

    heroCtx.fillStyle = HERO_COLOR;
    heroCtx.fillRect(HERO_MESH.userData.x, HERO_MESH.userData.y, PIXEL_SIZE, PIXEL_SIZE);
    ctx.drawImage(heroCanvas, 0, 0);
}

function imageToCanvas(img) {
    if(img.tagName === "CANVAS")return img;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
}
function imageToImageData(img) {
    const canvas = imageToCanvas(img);
    const ctx = canvas.getContext("2d");
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}











export default {}


