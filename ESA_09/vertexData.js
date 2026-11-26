var torus = ( function() {

	function createVertexData(outerRadius = 1.2, innerRadius = 0.18) {
		let n = 24;
		let m = 64;

		// Position, normal, vertexcolor
		this.vertices = new Float32Array(3 * 3 * 4 * 2 * (n + 1) * (m + 1));
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
				vertices[iVertex * 12] = x;
				vertices[iVertex * 12 + 1] = y;
				vertices[iVertex * 12 + 2] = z;

				// Calc and set normals.
				let nx = Math.cos(u) * Math.cos(v);
				let ny = Math.cos(u) * Math.sin(v);
				let nz = Math.sin(u);

				vertices[iVertex * 12 + 3] = nx;
				vertices[iVertex * 12 + 4] = ny;
				vertices[iVertex * 12 + 5] = nz;

				// Set vertex color (unused)
				vertices[iVertex * 12 + 6] = 1;
				vertices[iVertex * 12 + 7] = 1;
				vertices[iVertex * 12 + 8] = 1;
				vertices[iVertex * 12 + 9] = 1;

				// texture Coords
				vertices[iVertex * 12 + 10] = u / (2 * Math.PI);
				vertices[iVertex * 12 + 11] = v / (2 * Math.PI) * 3;

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

	function createVertexData(width = 3, depth = 3) {
		let n = 1;
		let m = 1;

		// Positions.
		this.vertices = new Float32Array(3 * 3 * 4 * 2 * (n + 1) * (m + 1));
		let vertices = this.vertices;

		// Index data.
		this.indicesLines = new Uint16Array(2 * 2 * n * m);
		let indicesLines = this.indicesLines;
		this.indicesTris = new Uint16Array(3 * 2 * n * m);
		let indicesTris = this.indicesTris;

		let du = width / n;
		let dv = depth / m;
		// Counter for entries in index array.
		let iLines = 0;
		let iTris = 0;

		// Loop u.
		for(let i = 0, u = -width / 2.; i <= n; i++, u += du) {
			// Loop v.
			for(let j = 0, v = -depth / 2.; j <= m; j++, v += dv) {

				let iVertex = i * (m + 1) + j;

				let x = u;
				let y = 0;
				let z = v;

				// Set vertex positions.
				vertices[iVertex * 12] = x;
				vertices[iVertex * 12 + 1] = y;
				vertices[iVertex * 12 + 2] = z;

				// Calc and set normals.
				vertices[iVertex * 12 + 3] = 0;
				vertices[iVertex * 12 + 4] = 1;
				vertices[iVertex * 12 + 5] = 0;

				// Vertex colors (unused)
				vertices[iVertex * 12 + 6] = 1;
				vertices[iVertex * 12 + 7] = 1;
				vertices[iVertex * 12 + 8] = 1;
				vertices[iVertex * 12 + 9] = 1;
				
				// Set texture coordinate.
				vertices[iVertex * 12 +10] = (u + width / 2.) / width; // s
				vertices[iVertex * 12 + 11] = (v + depth / 2.) / depth; // t

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
					indicesTris[iTris++] = iVertex;
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
					//
					indicesTris[iTris++] = iVertex - 1;
					indicesTris[iTris++] = iVertex - (m + 1) - 1;
					indicesTris[iTris++] = iVertex - (m + 1);
				}
			}
		}
	}

	return {
		createVertexData : createVertexData
	};

}());
