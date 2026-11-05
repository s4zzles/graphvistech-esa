var torus = ( function() {

	function createVertexData(outerRadius = 1.2, innerRadius = 0.18) {
		let n = 12;
		let m = 32;

		// Position, normal, vertexcolor
		this.vertices = new Float32Array(3 * 3 * 4 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(2 * 2 * n * m);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = 2 * Math.PI / n;
		let dv = 2 * Math.PI / m;
		let r = innerRadius;
		let R = outerRadius;
		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop angle u.
		for(let i = 0, u = 0; i <= n; i++, u += du) {
			// Loop angle v.
			for(let j = 0, v = 0; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = (R + r * Math.cos(u) ) * Math.cos(v);
				let y = (R + r * Math.cos(u) ) * Math.sin(v);
				let z = r * Math.sin(u);


				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;



				// Calc and set normals.
				let nx = Math.cos(u) * Math.cos(v);
				let ny = Math.cos(u) * Math.sin(v);
				let nz = Math.sin(u);

				vertices[iVertex * 10 + 3] = nx;
				vertices[iVertex * 10 + 4] = ny;
				vertices[iVertex * 10 + 5] = nz;

				// Set vertex color
				vertices[iVertex * 10 + 6] = Math.max(Math.cos(u), 0);
				vertices[iVertex * 10 + 7] = 0.25;
				vertices[iVertex * 10 + 8] = Math.max(-Math.cos(u), 0);
				vertices[iVertex * 10 + 9] = 1;


				// Set index.
				// Line on beam.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}
				// Line on ring.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - (m + 1);
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					let t1v1 = iVertex;
					let t1v2 = iVertex -1;
					let t1v3 = iVertex - (m + 1);

					let t2v1 = iVertex - 1;
					let t2v2 = iVertex - (m + 1) - 1;
					let t2v3 = iVertex - (m + 1);

					indicesTris[iTris++] = t1v1;
					indicesTris[iTris++] = t1v2;
					indicesTris[iTris++] = t1v3;
					//
					indicesTris[iTris++] = t2v1;
					indicesTris[iTris++] = t2v2;
					indicesTris[iTris++] = t2v3;
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());

var plane = ( function() {

	function createVertexData() {
		let n = 15; // x verts
		let m = 15; // z verts

		let width = 4;
		let depth = 4;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * (n * m));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(4 * n * m - 2 * n - 2 * m);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(2 * 3 * (n - 1) * (m - 1));
		let indicesTris = this.indicesTris;

		let du = width / n;
		let dv = depth / m;

		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop width
		for(let i = 0, u = -width / 2 + du / 2; i < n; i++, u += du) {
			// Loop depth
			for(let j = 0, v = -depth / 2 + dv / 2; j < m; j++, v += dv) {

				let iVertex = (i * m) + j;

				let x = u;
				let y = 0;
				let z = v;

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.
				let nx = 0;
				let ny = 1;
				let nz = 0;
				vertices[iVertex * 10 + 3] = nx;
				vertices[iVertex * 10 + 4] = ny;
				vertices[iVertex * 10 + 5] = nz;

				// set vertex color
				vertices[iVertex * 10 + 6] = 0;
				vertices[iVertex * 10 + 7] = 0;
				vertices[iVertex * 10 + 8] = 0;
				vertices[iVertex * 10 + 9] = 1;

				// Set index.
				if(j > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}

				if(i > 0) {
					indicesLines[iLines++] = iVertex - m;
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					//
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - (m + 1) + 1;
					indicesTris[iTris++] = iVertex;
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());


var cylinder = ( function() {

	function createVertexData() {
		let n = 24; // circle verts
		let m = 2; // line verts

		let r = 1;
		let height = 2;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(4 * m * n + 2 * n);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = Math.PI * 2 / n;
		let dv = height / m;

		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop width
		for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {
			// Loop depth
			for(let j = 0, v = 0; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = r * Math.cos(u);
				let y = v;
				let z = r * Math.sin(u);

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.
				let nx = Math.cos(u);
				let ny = 0;
				let nz = Math.sin(u);
				vertices[iVertex * 10 + 3] = nx;
				vertices[iVertex * 10 + 4] = ny;
				vertices[iVertex * 10 + 5] = nz;

				// set vertex color
				vertices[iVertex * 10 + 6] = (nx + 1) / 2;
				vertices[iVertex * 10 + 7] = (ny + 1) / 2;
				vertices[iVertex * 10 + 8] = (nz + 1) / 2;
				vertices[iVertex * 10 + 9] = 1;


				// Set index.
				// Line on beam.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}
				// Line on ring.
				if(i > 0) {
					indicesLines[iLines++] = iVertex - (m + 1);
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1) - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());

var cone = ( function() {

	function createVertexData() {
		let n = 24; // circle verts
		let m = 2; // line verts

		let r = 0.2;
		let height = 1.5;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(4 * m * n + 2 * n);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = Math.PI * 2 / n;
		let dv = height / m;

		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop width
		for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {
			// Loop depth
			for(let j = 0, v = 0; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = r * v * Math.cos(u);
				let y = -v + height;
				let z = r * v * Math.sin(u);

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.
				let nx = Math.cos(u);
				let ny = r;
				let nz = Math.sin(u);
				let vertexLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
				vertices[iVertex * 10 + 3] = nx / vertexLength;
				vertices[iVertex * 10 + 4] = ny / vertexLength;
				vertices[iVertex * 10 + 5] = nz / vertexLength;

				// set vertex color
				vertices[iVertex * 10 + 6] = (nx + 1) / 2;
				vertices[iVertex * 10 + 7] = (ny + 1) / 2;
				vertices[iVertex * 10 + 8] = (nz + 1) / 2;
				vertices[iVertex * 10 + 9] = 1;

				// Set index.
				// Line on beam.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}
				// Line on ring.
				if(i > 0) {
					indicesLines[iLines++] = iVertex - (m + 1);
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - 1;
					
					
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - (m + 1) - 1;
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());

var disk = ( function() {

	function createVertexData(radius) {
		let n = 32; // circle verts
		let m = 8; // line verts

		let r = radius;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(4 * m * n + 2 * n);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = Math.PI * 2 / n;
		let dv = 1 / m;

		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop width
		for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {
			// Loop depth
			for(let j = 0, v = 0; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = r * v * Math.cos(u);
				let y = 0;
				let z = r * v * Math.sin(u);

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.
				let nx = 0;
				let ny = 1;
				let nz = 0;
				let vertexLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
				vertices[iVertex * 10 + 3] = nx / vertexLength;
				vertices[iVertex * 10 + 4] = ny / vertexLength;
				vertices[iVertex * 10 + 5] = nz / vertexLength;

				// set vertex colors
				vertices[iVertex * 10 + 6] = 1;
				vertices[iVertex * 10 + 7] = 0;
				vertices[iVertex * 10 + 8] = 1;
				vertices[iVertex * 10 + 9] = 1;


				// Set index.
				// Line on beam.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}
				// Line on ring.
				if(i > 0) {
					indicesLines[iLines++] = iVertex - (m + 1);
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - 1;
					
					
					
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - (m + 1) - 1;
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());

var sphere = ( function() {

	function createVertexData(radius = 1, red = 0, blue = 0) {
		let n = 24; // circle verts
		let m = 12; // line verts

		let r = radius;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(4 * m * n + 2 * n);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = Math.PI * 2 / n;
		let dv = Math.PI / m;

		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop width
		for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {
			// Loop depth
			for(let j = 0, v = 0; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = r * Math.sin(v) * Math.cos(u);
				let y = r * Math.cos(v);
				let z = r * Math.sin(v) * Math.sin(u);

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.

				let vertexLength = Math.sqrt(x*x+y*y+z*z);
				let nx = x/vertexLength;
				let ny = y/vertexLength;
				let nz = z/vertexLength;
				vertices[iVertex * 10 + 3] = nx;
				vertices[iVertex * 10 + 4] = ny;
				vertices[iVertex * 10 + 5] = nz;

				// set vertex color
				vertices[iVertex * 10 + 6] = red;
				vertices[iVertex * 10 + 7] = Math.cos(12 * v);
				vertices[iVertex * 10 + 8] = blue;
				vertices[iVertex * 10 + 9] = 1;


				// Set index.
				// Line on beam.
				if(j > 0 && i > 0) {
					indicesLines[iLines++] = iVertex - 1;
					indicesLines[iLines++] = iVertex;
				}
				// Line on ring.
				if(i > 0) {
					indicesLines[iLines++] = iVertex - (m + 1);
					indicesLines[iLines++] = iVertex;
				}

				// Set index.
				// Two Triangles.
				if(j > 0 && i > 0) {
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - 1;
					
					
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					indicesTris[iTris++] = iVertex - (m + 1) - 1;
					
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	}

}());
