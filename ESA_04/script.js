"use strict";

let canvas01 = document.getElementById('canvas01');
let canvas02 = document.getElementById('canvas02');
let canvas03 = document.getElementById('canvas03');


drawOnCanvas(canvas01, "DINI");
//drawOnCanvas(canvas02, "HORN");
//drawOnCanvas(canvas03), "CUSTOM";

function drawOnCanvas(canvas, mode) {
    let gl = canvas.getContext('experimental-webgl');

    
    // Background  color
    gl.clearColor(0.7, 0.7, 0.8, 1);

    // vertex shader
    let vsSource = 
                    'attribute vec3 pos;' +
                    'attribute vec4 col;' +
                    'varying vec4 color;' +
        'void main(){color = col; gl_Position = vec4(2.0 * pos, 1);}';
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

    let vertices, indicesLines, indicesTris;


    switch (mode) {
        case "DINI":
           ({ vertices, indicesLines, indicesTris } = createVertexDataDini(vertices, indicesLines, indicesTris));
            console.log("test");
            break;
        case "HORN":
            ({ vertices, indicesLines, indicesTris } = createVertexDataHorn(vertices, indicesLines, indicesTris));
            console.log("test2");
            break;
    }

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    // Bind vertex buffer to attribute variable
    let posAttrib = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    let colAttrib = gl.getAttribLocation(prog, 'col');


    // Clear canvas and draw call
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib4f(colAttrib, 1, 0, 1, 1);
    let iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTris,
        gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indicesTris.length, gl.UNSIGNED_SHORT, 0);

    gl.vertexAttrib4f(colAttrib, 0, 0, 0.5, 1);
    let iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLines,
        gl.STATIC_DRAW);

    gl.drawElements(gl.LINES, indicesLines.length, gl.UNSIGNED_SHORT, 0);
}

function createVertexDataDini(vertices, indicesLines, indicesTris){
    let n = 32;
    let m = 12;
    // Positions.
    vertices = new Float32Array(3*(n+1)*(m+1));
    // Index data for Line.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris = new Uint16Array(3 * 2 * m * n);

    let dt = 4*Math.PI/n;
    let dr = 1/m;
    // Counter for entries in index array.
    let iIndexLines = 0;
    let iIndexTris = 0;

    const a = 0.3;
    const b = 0.5;

    // Loop angle t.
    for(let i=0, t= 0; i <= n; i++, t += dt) {

        // Loop radius r.
        for(let j=0, r=0.01; j <= m; j++, r += dr){

            let iVertex = i*(m+1) + j;

            // Dini surface (side) t >= 0.01!!
            let x = (a * Math.cos(t) * Math.sin(r));
            let y = (a * (Math.cos(r) + Math.log(Math.tan(r / 2))) + b * t) / 10;
            let z =( a * Math.sin(t) * Math.sin(r));

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iIndexLines++] = iVertex - 1;
                indicesLines[iIndexLines++] = iVertex;
            }

            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iIndexLines++] = iVertex-(m+1);
                indicesLines[iIndexLines++] = iVertex;
            }

            // 2 Tris
            if(j>0 && i>0) {
                indicesTris[iIndexTris++] = iVertex;
                indicesTris[iIndexTris++] = iVertex - 1;
                indicesTris[iIndexTris++] = iVertex - (m + 1);

                indicesTris[iIndexTris++] = iVertex - 1;
                indicesTris[iIndexTris++] = iVertex - 1 - (m + 1);
                indicesTris[iIndexTris++] = iVertex - (m + 1);

            }
        }
    }
    return {
        vertices, 
        indicesLines, 
        indicesTris
    };
}

function createVertexDataHorn(vertices, indicesLines, indicesTris){
    let n = 64;
    let m = 24;
    // Positions.
    vertices = new Float32Array(3*(n+1)*(m+1));
    // Index data for Line.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris = new Uint16Array(3 * 2 * m * n);

    let dt = 2*Math.PI/n;
    let dr = 1/m;
    // Counter for entries in index array.
    let iIndexLines = 0;
    let iIndexTris = 0;

    const a = 2;
    const b = 2.5;
    const c = 1.6;

    // Loop angle t.
    for(let i=0, t= -Math.PI; i <= n; i++, t += dt) {

        // Loop radius r.
        for(let j=0, r=0; j <= m; j++, r += dr){

            let iVertex = i*(m+1) + j;

            // Funnel -> basis für eigenkreation oder so
            // let x = r * Math.cos(t);
            // let y = Math.log(r) / 2 + 0.5;
            // let z = r * Math.sin(t);

            // horn top a,b,c consts
            let x = (a + r * Math.cos(t)) * Math.sin(b * Math.PI * r);
            let y = (a + r * Math.cos(t)) * Math.cos(b * Math.PI * r) + c * r;
            let z = r * Math.sin(t);

            // horn side
            // let x = (a + r * Math.cos(t)) * Math.sin(b * Math.PI * r);
            // let y = r * Math.sin(t);
            // let z = (a + r * Math.cos(t)) * Math.cos(b * Math.PI * r) + c * r;

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iIndexLines++] = iVertex - 1;
                indicesLines[iIndexLines++] = iVertex;
            }

            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iIndexLines++] = iVertex-(m+1);
                indicesLines[iIndexLines++] = iVertex;
            }

            // 2 Tris
            if(j>0 && i>0) {
                indicesTris[iIndexTris++] = iVertex;
                indicesTris[iIndexTris++] = iVertex - 1;
                indicesTris[iIndexTris++] = iVertex - (m + 1);

                indicesTris[iIndexTris++] = iVertex - 1;
                indicesTris[iIndexTris++] = iVertex - 1 - (m + 1);
                indicesTris[iIndexTris++] = iVertex - (m + 1);

            }
        }
    }
}