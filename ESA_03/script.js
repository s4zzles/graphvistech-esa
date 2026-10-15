"use strict";

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('experimental-webgl');

// Pipeline setup
gl.clearColor(1, 0.75, 0.9, 1);

// Compile a vertex shader
let vsSource = 
                'attribute vec2 pos;' +
                'attribute vec4 col;' +
                'varying vec4 color;' +
    'void main(){color = col; gl_Position = vec4(2.0 * pos - 1.0, 0, 1);}'; // to check!
let vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile a fragment shader
let fsSource =  'precision mediump float;' + 
                'varying vec4 color;' + 'void main() { gl_FragColor = color; }';
let fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

// Link together into a program
let prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);


let orangeCol = new Float32Array([0.8,0.3,0,1]);
let yellowCol = new Float32Array([1,1,0,1]);
let greenCol = new Float32Array([0.1,0.6,0.2,1]);
// Load vertex data (pos,col) into buffer (array of structure)
let vertices = new Float32Array([
    0.508,0.047, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.675,0.057, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.828,0.117, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.922,0.214, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.947,0.402, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.874,0.577, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.741,0.690, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.600,0.745, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.560,0.697, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.475,0.695, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3], // i=9
    0.415,0.745, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.260,0.687, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.143,0.576, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.069,0.387, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.088,0.233, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.185,0.126, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.341,0.057, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.598,0.117, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.598,0.117, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.733,0.238, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3], // i=19
    0.733,0.238, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.626,0.230, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.626,0.230, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.572,0.174, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.572,0.174, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.512,0.219, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.512,0.219, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.397,0.223, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.397,0.223, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.257,0.259, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3], // i=29
    0.257,0.259, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.408,0.118, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.408,0.118, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.463,0.294, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.463,0.294, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.561,0.295, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.561,0.295, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.508,0.405, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.508,0.405, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.593,0.390, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3], // i=39
    0.593,0.390, 1,0.5,0,1,
    0.782,0.410, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.782,0.410, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.676,0.539, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.676,0.539, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.253,0.421, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.253,0.421, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.431,0.398, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3],
    0.431,0.398, 1,0.5,0,1,
    0.364,0.545, orangeCol[0],orangeCol[1],orangeCol[2],orangeCol[3], // i=49
    0.364,0.545, yellowCol[0],yellowCol[1],yellowCol[2],yellowCol[3],
    0.415,0.745, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.475,0.695, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.560,0.697, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.600,0.745, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.447,0.801, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.574,0.850, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.411,0.882, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.476,0.928, greenCol[0],greenCol[1],greenCol[2],greenCol[3],
    0.353,0.924, greenCol[0],greenCol[1],greenCol[2],greenCol[3], // i=59
    0.409,0.965, greenCol[0],greenCol[1],greenCol[2],greenCol[3]
]);

let indices = new Uint16Array([
    0,1,17,
    1,2,17,
    17,2,19,
    0,17,31,
    2,3,19,
    19,3,4,
    19,4,41,
    41,4,5,
    41,5,43,
    43,5,6,
    43,6,7,
    43,7,8,
    39,43,8,
    39,19,41,
    39,35,19,
    21,19,35,
    25,21,35,
    25,23,21,
    25,35,33,
    35,39,37,
    33,37,47,
    27,25,33,
    29,27,33,
    29,33,47,
    29,47,45,
    37,39,8,
    37,8,9,
    47,37,9,
    49,47,9,
    49,9,10,
    11,49,10,
    12,49,11,
    12,45,49,
    13,45,12,
    13,29,45,
    14,29,13,
    14,15,29,
    15,31,29,
    15,16,31,
    16,0,31, // orange tris
    30,32,28,
    28,32,26,
    32,24,26,
    32,18,24,
    18,22,24,
    18,20,22,
    34,36,38,
    40,42,44,
    46,48,50, // yellow tris
    51,52,55,
    52,53,55,
    53,54,56,
    53,56,55,
    55,56,57,
    57,56,58,
    57,58,60,
    59,57,60 // green tris
]);



let vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


// Bind vertex buffer to attribute variable
let posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 24, 0);
gl.enableVertexAttribArray(posAttrib);

let colAttrib = gl.getAttribLocation(prog, 'col');
gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 24, 8);
gl.enableVertexAttribArray(colAttrib);


// Clear canvas and draw calls
gl.clear(gl.COLOR_BUFFER_BIT);

let ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);