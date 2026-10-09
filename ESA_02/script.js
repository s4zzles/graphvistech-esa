"use strict";

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('experimental-webgl');

// Pipeline setup
gl.clearColor(0.8, 1, 1, 1);

// Compile a vertex shader
let vsSource = 'attribute vec2 pos;'+
    'void main(){gl_Position = vec4(2.0 * pos - vec2(1), 0, 1);}';
let vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile a fragment shader
let fsSource =  'void main() { gl_FragColor = vec4(0,0,1,1); }';
let fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

// Link together into a program
let prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

// Load vertex data into a buffer
let vertices = new Float32Array([
    0.213,0.567,
    0.211,0.563,
    0.214,0.540,
    0.216,0.539,
    0.222,0.493,
    0.244,0.431,
    0.315,0.385,
    0.329,0.313,
    0.295,0.291,
    0.295,0.265, //Pfote 1 i=9
    0.361,0.265,
    0.377,0.320,
    0.380,0.381,
    0.496,0.383,
    0.643,0.413,
    0.691,0.384,
    0.765,0.355,
    0.770,0.311,
    0.740,0.293,
    0.742,0.265, //Pfote 2 i=19
    0.803,0.265,
    0.816,0.353,
    0.786,0.402,
    0.776,0.462,
    0.840,0.444,
    0.917,0.453,
    0.962,0.480,
    0.905,0.479,
    0.819,0.497,
    0.766,0.536, //i=29
    0.709,0.565,
    0.639,0.572,
    0.499,0.577,
    0.369,0.604,
    0.330,0.639,
    0.331,0.643,
    0.316,0.666,
    0.312,0.666,
    0.273,0.751,
    0.215,0.779, //i=39
    0.147,0.774,
    0.109,0.736,
    0.042,0.718,
    0.022,0.692,
    0.061,0.650,
    0.146,0.647,
    0.172,0.633,
    0.173,0.595,
    0.181,0.572, //Ende Outline
    0.204,0.745, //i=49
    0.183,0.688,
    0.258,0.718,
    0.272,0.638,
    0.249,0.592, // Ende Ohr
    0.286,0.631,
    0.265,0.568,
    0.307,0.610, //Ende Halsband
    0.169,0.735,
    0.155,0.745,
    0.141,0.736, //i=59
    0.146,0.722,
    0.163,0.721, // Ende Auge
    0.041,0.688,
    0.055,0.702 // Ende Nase
]);

let outlineIndices = new Uint16Array(49);
for(let i = 0; i <= 48; i++) {
    outlineIndices[i] = i;
}

let eyeIndices = new Uint16Array([
    57, 58, 59, 60, 61
]);

let noseIndices = new Uint16Array([
    43, 62, 63, 42
]);

let ear1Indices = new Uint16Array([
    51, 52, 53, 0
]);

let ear2Indices = new Uint16Array([
    49, 50, 46
]);

let collar1Indices = new Uint16Array([
    53, 54, 37
]);

let collar2Indices = new Uint16Array([
    3, 55, 56, 34
]);


let vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


// Bind vertex buffer to attribute variable
let posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);


// Clear canvas and draw calls
gl.clear(gl.COLOR_BUFFER_BIT);

let iboOutline = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboOutline);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, outlineIndices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_LOOP, outlineIndices.length, gl.UNSIGNED_SHORT, 0);


let iboEye = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboEye);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, eyeIndices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_LOOP, eyeIndices.length, gl.UNSIGNED_SHORT, 0);


let iboNose = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboNose);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, noseIndices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_STRIP, noseIndices.length, gl.UNSIGNED_SHORT, 0);

let iboEar1 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboEar1);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ear1Indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_STRIP, ear1Indices.length, gl.UNSIGNED_SHORT, 0);

let iboEar2 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboEar2);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ear2Indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_STRIP, ear2Indices.length, gl.UNSIGNED_SHORT, 0);

let iboCollar2 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboCollar2);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, collar2Indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_STRIP, collar2Indices.length, gl.UNSIGNED_SHORT, 0);

let iboCollar1 = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboCollar1);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, collar1Indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.LINE_STRIP, collar1Indices.length, gl.UNSIGNED_SHORT, 0);