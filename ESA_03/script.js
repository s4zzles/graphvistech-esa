"use strict";

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('experimental-webgl');

// Background  color
gl.clearColor(0.4, 0.25, 0.4, 1);

// vertex shader
let vsSource = 
                'attribute vec2 pos;' +
                'attribute vec4 col;' +
                'varying vec4 color;' +
    'void main(){color = col; gl_Position = vec4(2.0 * pos - 1.0, 0, 1);}';
let vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// fragment shader
let fsSource =  'precision mediump float;' + 
                'varying vec4 color;' + 'void main() { gl_FragColor = color; }';
let fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

let prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);


// vertex color variables
let orangeCol1 = new Float32Array([0.8,0.35,0.1,1]);
let orangeCol2 = new Float32Array([0.95,0.5,0,1]);
let orangeCol3 = new Float32Array([0.7,0.25,0.25,1]);
let yellowCol1 = new Float32Array([0.95,0.5,0,1]);
let yellowCol2 = new Float32Array([1,1,0,1]);
let greenCol1 = new Float32Array([0.1,0.6,0.2,1]);
let greenCol2 = new Float32Array([0.3,0.8,0.3,1]);
// Load vertex data (pos,col) into buffer (array of structure)
let vertices = new Float32Array([
    0.508,0.047, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.675,0.057, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.828,0.117, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.922,0.214, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.947,0.402, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.874,0.577, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.741,0.690, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3],
    0.600,0.745, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3],
    0.560,0.697, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3],
    0.475,0.695, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3], // i=9
    0.415,0.745, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3],
    0.260,0.687, orangeCol2[0],orangeCol2[1],orangeCol2[2],orangeCol2[3],
    0.143,0.576, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.069,0.387, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.088,0.233, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.185,0.126, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.341,0.057, orangeCol3[0],orangeCol3[1],orangeCol3[2],orangeCol3[3],
    0.598,0.117, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.598,0.117, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.733,0.238, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3], // i=19
    0.733,0.238, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.626,0.230, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.626,0.230, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.572,0.174, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.572,0.174, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.512,0.219, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.512,0.219, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.397,0.223, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.397,0.223, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.257,0.259, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3], // i=29
    0.257,0.259, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.408,0.118, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.408,0.118, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.463,0.294, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.463,0.294, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.561,0.295, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.561,0.295, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.508,0.405, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.508,0.405, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.593,0.390, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3], // i=39
    0.593,0.390, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.782,0.410, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.782,0.410, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.676,0.539, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.676,0.539, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.253,0.421, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.253,0.421, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.431,0.398, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3],
    0.431,0.398, yellowCol2[0],yellowCol2[1],yellowCol2[2],yellowCol2[3],
    0.364,0.545, orangeCol1[0],orangeCol1[1],orangeCol1[2],orangeCol1[3], // i=49
    0.364,0.545, yellowCol1[0],yellowCol1[1],yellowCol1[2],yellowCol1[3],
    0.415,0.745, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.475,0.695, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.560,0.697, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.600,0.745, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.447,0.801, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.574,0.850, greenCol1[0],greenCol1[1],greenCol1[2],greenCol1[3],
    0.411,0.882, greenCol2[0],greenCol2[1],greenCol2[2],greenCol2[3],
    0.476,0.928, greenCol2[0],greenCol2[1],greenCol2[2],greenCol2[3],
    0.353,0.924, greenCol2[0],greenCol2[1],greenCol2[2],greenCol2[3], // i=59
    0.409,0.965, greenCol2[0],greenCol2[1],greenCol2[2],greenCol2[3]
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
    16,0,31, // end of orange tris
    30,32,28,
    28,32,26,
    32,24,26,
    32,18,24,
    18,22,24,
    18,20,22,
    34,36,38,
    40,42,44,
    46,48,50, // end of yellow tris
    51,52,55,
    52,53,55,
    53,54,56,
    53,56,55,
    55,56,57,
    57,56,58,
    57,58,60,
    59,57,60 // end of green tris
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


//backface culling
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

// Clear canvas and draw call
gl.clear(gl.COLOR_BUFFER_BIT);

let ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices,
    gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);