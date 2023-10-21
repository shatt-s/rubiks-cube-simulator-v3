
class Face {
    constructor(x, y, z, rot, ID) {
        this.position = createVector(x, y, z);
        this.axis = rot;
        // this.target = 0;
        this.colour = -1;
        this.ID = ID;
    }

    colours = [color(255, 60, 60),     // Red
               color(60, 255, 60),     // Green
               color(255, 255, 255),   // White
               color(255, 255, 0),     // Yellow
               color(60, 60, 255),     // Blue
               color(255, 145, 0)      // Orange
    ];

    setColour(col) {
        this.colour = col;
    }

    getColour() {
        return this.colours[this.colour - 1].levels;
    }

    mDraw() {
        push();
        translate(this.position);
        rotate(HALF_PI, this.axis);
        fill(this.colours[this.colour - 1]);
        // fill((this.ID >> 16) & 0xFF, (this.ID >> 8) & 0xF, this.ID & 0xFF);
        // noStroke();
        // mPlane(-0.5, -0.5, 0,
        //     -0.5, 0.5, 0,
        //     0.5, 0.5, 0,
        //     0.5, -0.5, 0,
        //     -0.5, -0.5, 0
        // );

        strokeWeight(0);
        noStroke();
        fill((this.ID >> 16) & 0xFF, (this.ID >> 8) & 0xF, this.ID & 0xFF);
        beginShape();
        vertex(-0.5, -0.5, 0);
        vertex(-0.5, 0.5, 0);
        vertex(0.5, 0.5, 0);
        vertex(0.5, -0.5, 0);
        vertex(-0.5, -0.5, 0);
        endShape(CLOSE);
        pop();
    }

    draw() {
        push();
        translate(this.position);
        rotate(HALF_PI, this.axis);
        fill(this.colours[this.colour - 1]);
        // fill((this.ID >> 16) & 0xFF, (this.ID >> 8) & 0xF, this.ID & 0xFF);
        // noStroke();
        // mPlane(-0.5, -0.5, 0,
        //     -0.5, 0.5, 0,
        //     0.5, 0.5, 0,
        //     0.5, -0.5, 0,
        //     -0.5, -0.5, 0
        // );
        beginShape();
        vertex(-0.5, -0.5, 0);
        vertex(-0.5, 0.5, 0);
        vertex(0.5, 0.5, 0);
        vertex(0.5, -0.5, 0);
        vertex(-0.5, -0.5, 0);
        endShape(CLOSE);
        pop();
    }
}

new p5();

const X = createVector(1, 0, 0);
const Y = createVector(0, 1, 0);
const Z = createVector(0, 0, 1);

let fields = [
    3, 3, 3, 3,     // Down
    2, 2, 2, 2,     // Left
    1, 1, 1, 1,     // Back
    4, 4, 4, 4,     // Up
    5, 5, 5, 5,     // Right
    6, 6, 6, 6      // Front
];

let faces = [
    new Face(-0.5, 1, -0.5, X, 100), new Face(0.5, 1, -0.5, X, 100), new Face(-0.5, 1, 0.5, X, 100), new Face(0.5, 1, 0.5, X, 100),
    new Face(-1, -0.5, 0.5, Y, 101), new Face(-1, -0.5, -0.5, Y, 101), new Face(-1, 0.5, 0.5, Y, 101), new Face(-1, 0.5, -0.5, Y, 101),
    new Face(-0.5, -0.5, -1, Z, 102), new Face(0.5, -0.5, -1, Z, 102), new Face(-0.5, 0.5, -1, Z, 102), new Face(0.5, 0.5, -1, Z, 102),
    new Face(-0.5, -1, -0.5, X, 103), new Face(0.5, -1, -0.5, X, 103), new Face(-0.5, -1, 0.5, X, 103), new Face(0.5, -1, 0.5, X, 103),
    new Face(1, -0.5, 0.5, Y, 104), new Face(1, -0.5, -0.5, Y, 104), new Face(1, 0.5, 0.5, Y, 104), new Face(1, 0.5, -0.5, Y, 104),
    new Face(-0.5, -0.5, 1, Z, 105), new Face(0.5, -0.5, 1, Z, 105), new Face(-0.5, 0.5, 1, Z, 105), new Face(0.5, 0.5, 1, Z, 105)
];

let moves = {};
let lastMove = "";
let possibleMoves = [
    "U", "R", "F",
    "U'", "R'", "F'",
    "U2", "R2", "F2"
];


//     3 3
//     3 3
// 1 1 5 5 4 4 0 0
// 1 1 5 5 4 4 0 0
//     2 2
//     2 2

//       12 13
//       14 15
// 5  4  20 21 16 17 9  8
// 7  6  22 23 18 19 11 10
//       2  3
//       0  1

// Corners
// 4 14 20 *
// 2 6 22 *
// 3 18 23 *
// 15 16 21 *
// 0 7 10 *
// 1 11 19 *
// 9 13 17 *
// 5 8 12 *

function arrayEquals(a1,a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}

function objectAtMouse() {
    return getObjectID(mouseX, mouseY);
}

function getObjectID(mx, my) {
	if (mx > width || my > height || mx < 0 || my < 0) {
		return 0;
	}

    for (let i = 0; i < faces.length; i++) {
        faces[i].mDraw();
    }

	var pix = getPixels();
	var index = 4 * ((gl.drawingBufferHeight-my) * gl.drawingBufferWidth+mx);
    return (pix[index]<<16 | pix[index+1]<<8 | pix[index+2]);
}

function getPixels() {
	var gl = canvas.getContext('webgl');
	var pix = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
	gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pix);
	return (pix);
}

let solveButton;
async function preload() {
    solveButton = createButton("Solve");
    solveButton.position(5, 5);
    solveButton.mousePressed((await solve));
    solveButton.addClass("customButton");
}

let webglCanvas;
let easyCam;
let gl;
function setup() {
    webglCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    gl = canvas.getContext('webgl');
    // context = webglCanvas.drawingContext;
    // cam = createCamera();
    // cam = mCamera();
    easyCam = createEasyCam();
    easyCam.setZoomScale(0);
    easyCam.setPanScale(0);
    easyCam.setWheelScale(0);

    pixelDensity(1);

    // gl = easyCam.graphics;
    // ortho();

    document.oncontextmenu = () => false;

    // for (let i = 0; i < faces.length; i++) {
    //     print(faces[i].getSideColour());
    // }
}

function draw() {
    // orbitControl(3);
    background(220);
    scale(70)
    // if (faces[0].colour == -1) {
    //     setupColours();
    // }
    setColours();

    // for (let i = 0; i < faces.length; i++) {
    //     faces[i].predraw();
    // }

    // loadPixels();
    // mousePixel = webglCanvas.get(mouseX, mouseY);

    // easyCam.beginHUD();
    // fill(mousePixel);
    // noStroke();
    // translate(5,0,0);
    // box(5);
    // easyCam.endHUD();
    // updatePixels();


    for (let i = 0; i < faces.length; i++) {
        faces[i].draw();
    }
    // mousePixel = get(mouseX, mouseY);
}

function mousePressed() {
    let object = objectAtMouse();
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        // print(object)
        if (object == 14474460 || object == 0) break;
        if (face.ID == object) {
            if (i < 24 && i >= 20 ) {
                F();
                break;
            } else if (i < 20 && i >= 16 ) {
                R();
                break;
            } else if (i < 16 && i >= 12 ) {
                U();
                break;
            } else if (i < 12 && i >= 8 ) {
                B();
                break;
            } else if (i < 8 && i >= 4 ) {
                L();
                break;
            } else if (i < 4 && i >= 0 ) {
                D();
                break;
            }
        }
    }
}

function keyPressed() {
    if (keyCode === 32)
        easyCam.reset();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function U() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[12] = d[14], fields[13] = d[12], fields[14] = d[15], fields[15] = d[13], fields[20] = d[16], fields[21] = d[17], fields[16] = d[9], fields[17] = d[8], fields[9] = d[5], fields[8] = d[4], fields[5] = d[20], fields[4] = d[21];
}

function UPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[14] = d[12], fields[12] = d[13], fields[15] = d[14], fields[13] = d[15], fields[16] = d[20], fields[17] = d[21], fields[9] = d[16], fields[8] = d[17], fields[5] = d[9], fields[4] = d[8], fields[20] = d[5], fields[21] = d[4];
}

function U2() {
    U();
    U();
}

function R() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[16] = d[18], fields[17] = d[16], fields[18] = d[19], fields[19] = d[17], fields[13] = d[21], fields[15] = d[23], fields[11] = d[13], fields[9] = d[15], fields[3] = d[11], fields[1] = d[9], fields[21] = d[3], fields[23] = d[1];
}

function RPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[18] = d[16], fields[16] = d[17], fields[19] = d[18], fields[17] = d[19], fields[21] = d[13], fields[23] = d[15], fields[13] = d[11], fields[15] = d[9], fields[11] = d[3], fields[9] = d[1], fields[3] = d[21], fields[1] = d[23];
}

function R2() {
    R();
    R();
}

function F() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[20] = d[22], fields[21] = d[20], fields[22] = d[23], fields[23] = d[21], fields[14] = d[6], fields[15] = d[4], fields[16] = d[14], fields[18] = d[15], fields[2] = d[18], fields[3] = d[16], fields[4] = d[2], fields[6] = d[3];
}

function FPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[22] = d[20], fields[20] = d[21], fields[23] = d[22], fields[21] = d[23], fields[6] = d[14], fields[4] = d[15], fields[14] = d[16], fields[15] = d[18], fields[18] = d[2], fields[16] = d[3], fields[2] = d[4], fields[3] = d[6];
}

function F2() {
    F();
    F();
}

function D() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[2] = d[0], fields[3] = d[2], fields[1] = d[3], fields[0] = d[1], fields[18] = d[22], fields[19] = d[23], fields[11] = d[18], fields[10] = d[19], fields[7] = d[11], fields[6] = d[10], fields[22] = d[7], fields[23] = d[6];
}

function DPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[0] = d[2], fields[2] = d[3], fields[3] = d[1], fields[1] = d[0], fields[22] = d[18], fields[23] = d[19], fields[18] = d[11], fields[19] = d[10], fields[11] = d[7], fields[10] = d[6], fields[7] = d[22], fields[6] = d[23];
}

function D2() {
    D();
    D();
}

function L() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[5] = d[7], fields[4] = d[5], fields[6] = d[4], fields[7] = d[6], fields[0] = d[22], fields[2] = d[20], fields[22] = d[14], fields[20] = d[12], fields[14] = d[8], fields[12] = d[10], fields[8] = d[0], fields[10] = d[2];
}

function LPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[0] = d[2], fields[2] = d[3], fields[3] = d[1], fields[1] = d[0], fields[22] = d[18], fields[23] = d[19], fields[18] = d[11], fields[19] = d[10], fields[11] = d[7], fields[10] = d[6], fields[7] = d[22], fields[6] = d[23];
}

function L2() {
    L();
    L();
}

function B() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[9] = d[11], fields[8] = d[9], fields[10] = d[8], fields[11] = d[10], fields[17] = d[1], fields[19] = d[0], fields[12] = d[17], fields[13] = d[19], fields[7] = d[12], fields[5] = d[13], fields[1] = d[7], fields[0] = d[5];
}

function BPrime() {
    for (var d = [], f = 0; 24 > f; f++) d[f] = fields[f];
    fields[11] = d[9], fields[9] = d[8], fields[8] = d[10], fields[10] = d[11], fields[1] = d[17], fields[0] = d[19], fields[17] = d[12], fields[19] = d[13], fields[12] = d[7], fields[13] = d[5], fields[7] = d[1], fields[5] = d[0];
}

function B2() {
    B();
    B();
}

//       12 13
//       14 15
// 5  4  20 21 16 17 9  8
// 7  6  22 23 18 19 11 10
//       2  3
//       0  1

function setColours() {
    for (let i = 0; i < 24; i++) {
        faces[i].setColour(fields[i]);
    }
}

function getOppositeMove(move) {
    if (move.includes("2"))
        return move
    if (move.includes("'"))
        return move[0]
    else
        return move[0] + "'"
}

function transformFields() {
    let newFieldsArray = new Float32Array([
        0.0, 0.0, fields[12], fields[13], 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, fields[14], fields[15], 0.0, 0.0, 0.0, 0.0,
        fields[5], fields[4], fields[20], fields[21], fields[16], fields[17], fields[9], fields[8],
        fields[7], fields[6], fields[22], fields[23], fields[18], fields[18], fields[11], fields[10],
        0.0, 0.0, fields[2], fields[3], 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, fields[0], fields[1], 0.0, 0.0, 0.0, 0.0,
    ])
    let newFields = new onnx.Tensor(newFieldsArray, 'float32', [1, 1, 6, 8])
    return newFields
}

function chooseMove(move, pMoves) {
    let newMove = "";
    if (move.length > 1) {
        switch (move[1]) {
            case "'":
                if (pMoves.includes(move[0])) move = move[0];
                else if (pMoves.includes(move[0] + "2")) newMove = move[0] + "2";
                break;
            case "2":
                if (pMoves.includes(move[0])) move = move[0];
                else if (pMoves.includes(move[0] + "'")) newMove = move[0] + "'";
                break;
        }
    } else {
        if (pMoves.includes(move[0] + "'")) newMove = move[0] + "'";
        else if (pMoves.includes(move[0] + "2")) newMove = move[0] + "2";
    }
    if (newMove == "") newMove = pMoves[Math.floor(Math.random() * pMoves.length)];
    return newMove;
}

async function predict(input) {
    const sess = new onnx.InferenceSession();
    await sess.loadModel('./data/onnx-model.onnx');
    const outputMap = await sess.run([input])
    const outputTensor = outputMap.values().next().value
    console.log(outputTensor.data)
    
    return onnx.ArgMax(outputTensor.data)
}

async function nextMove() {
    let move;
    let key = fields.toString();
    if (moves[key] === undefined || moves[key].length == 0) {
        moves[key] = [...possibleMoves];
        let newFields = transformFields();
        move = await predict(newFields);
        if (move == getOppositeMove(lastMove)) {
            moves[key].splice(moves[key].indexOf(move), 1);
            move = moves[key][Math.floor(Math.random() * moves[key].length)];
        } else if (move == lastMove) {
            moves[key].splice(moves[key].indexOf(lastMove), 1);
            move = moves[key][Math.floor(Math.random() * moves[key].length)];
        }
    } else {
        move = moves[key][Math.floor(Math.random() * moves[key].length)];
    }

    // moves[key].splice(moves[key].indexOf(move[0]), 1);
    // moves[key].splice(moves[key].indexOf(move[0] + "'"), 1);
    // moves[key].splice(moves[key].indexOf(move[0] + "2"), 1);
    // if (move == getOppositeMove(lastMove) || move == lastMove) {
    //     let index = array.indexOf(move);
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     index = array.indexOf(lastMove);
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     index = array.indexOf(move[0] + "2");
    //     if (index > -1) {
    //         array.splice(index, 1);
    //     }
    //     print(array)
    //     move = array[Math.floor(Math.random() * array.length)];
    // }
    lastMove = move;
    return move
}

let solveMoves = "";

async function solve() {
    counter = 0;
    while (!solved() && counter < 400) {
        let move = await nextMove();
        switch (move) {
            case "U":
                U();
                break;
            case "R":
                R();
                break;
            case "F":
                F();
                break;
            case "U'":
                UPrime();
                break;
            case "R'":
                RPrime();
                break;
            case "F'":
                FPrime();
                break;
            case "U2":
                U2();
                break;
            case "R2":
                R2();
                break;
            case "F2":
                F2();
                break;
        }
        solveMoves += move + " "
        counter += 1;
    }
    if (solved()) {
        if (solveMoves.length == 0) return false;
        alert(solveMoves);
        moves = {};
        solveMoves = "";
    } else {
        alert("Timed out with Partial Solve, click Solve again to complete it.")
    }
}

// fields = [3, 1, 3, 1, 4, 4, 5, 2, 5, 5, 1, 4, 6, 6, 6, 6, 3, 3, 2, 5, 2, 2, 1, 4]

// [3, 1, 3, 1, 4, 4, 5, 2, 5, 5, 1, 4, 6, 6, 6, 6, 3, 3, 2, 5, 2, 2, 1, 4]

function solved() {
    for (var side = 0; 24 > side; side += 4) {
        c = fields[side];
        for (var tile = 1; 4 > tile; tile++)
            if (fields[side + tile] != c) return false;
    }
    return true
}
