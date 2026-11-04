var torus = ( function() {

	function createVertexData(outerRadius = 1.2, innerRadius = 0.08, horizontal = true) {
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


				// switch y and z to render horizontal
				if(horizontal) {
					[y, z] = [z, y];
				}

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
				vertices[iVertex * 10 + 6] = 1;
				vertices[iVertex * 10 + 7] = 1;
				vertices[iVertex * 10 + 8] = 0;
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

					// switch winding order for horizontal render mode
					if(horizontal) {
						[t1v1, t1v3] = [t1v3, t1v1];
						[t2v1, t2v3] = [t2v3, t2v1];
					}
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
		this.vertices = new Float32Array(3 * (n * m));
		let vertices = this.vertices;
		// Normals.
		this.normals = new Float32Array(3 * (n * m));
		let normals = this.normals;
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
				vertices[iVertex * 3] = x;
				vertices[iVertex * 3 + 1] = y;
				vertices[iVertex * 3 + 2] = z;

				// Calc and set normals.
				let nx = 0;
				let ny = 1;
				let nz = 0;
				normals[iVertex * 3] = nx;
				normals[iVertex * 3 + 1] = ny;
				normals[iVertex * 3 + 2] = nz;


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
		this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
		let vertices = this.vertices;
		// Normals.
		this.normals = new Float32Array(3 * (n + 1) * (m + 1));
		let normals = this.normals;
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
				vertices[iVertex * 3] = x;
				vertices[iVertex * 3 + 1] = y;
				vertices[iVertex * 3 + 2] = z;

				// Calc and set normals.
				let nx = Math.cos(u);
				let ny = 0;
				let nz = Math.sin(u);
				normals[iVertex * 3] = nx;
				normals[iVertex * 3 + 1] = ny;
				normals[iVertex * 3 + 2] = nz;


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
		this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
		let vertices = this.vertices;
		// Normals.
		this.normals = new Float32Array(3 * (n + 1) * (m + 1));
		let normals = this.normals;
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
				vertices[iVertex * 3] = x;
				vertices[iVertex * 3 + 1] = y;
				vertices[iVertex * 3 + 2] = z;

				// Calc and set normals.
				let nx = Math.cos(u);
				let ny = r;
				let nz = Math.sin(u);
				let vertexLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
				normals[iVertex * 3] = nx /= vertexLength;
				normals[iVertex * 3 + 1] = ny /= vertexLength;
				normals[iVertex * 3 + 2] = nz /= vertexLength;


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

	function createVertexData() {
		let n = 32; // circle verts
		let m = 8; // line verts

		let r = 1.8;

		// Positions.
		this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
		let vertices = this.vertices;
		// Normals.
		this.normals = new Float32Array(3 * (n + 1) * (m + 1));
		let normals = this.normals;
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
				vertices[iVertex * 3] = x;
				vertices[iVertex * 3 + 1] = y;
				vertices[iVertex * 3 + 2] = z;

				// Calc and set normals.
				let nx = 0;
				let ny = 1;
				let nz = 0;
				let vertexLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
				normals[iVertex * 3] = nx / vertexLength;
				normals[iVertex * 3 + 1] = ny / vertexLength;
				normals[iVertex * 3 + 2] = nz / vertexLength;


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

	function createVertexData() {
		let n = 24; // circle verts
		let m = 12; // line verts

		let r = 0.6;

		// Positions.
		this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
		let vertices = this.vertices;
		// Normals.
		this.normals = new Float32Array(3 * (n + 1) * (m + 1));
		let normals = this.normals;
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
				vertices[iVertex * 3] = x;
				vertices[iVertex * 3 + 1] = y;
				vertices[iVertex * 3 + 2] = z;

				// Calc and set normals.

				let vertexLength = Math.sqrt(x*x+y*y+z*z);
				let nx = x/vertexLength;
				let ny = y/vertexLength;
				let nz = z/vertexLength;
				normals[iVertex * 3] = nx;
				normals[iVertex * 3 + 1] = ny;
				normals[iVertex * 3 + 2] = nz;


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


var icosphere = (function() {

    function createVertexData(radius = 1, depth = 2) {

        let vertices = [];
        let normals = [];
        let indicesTris = [];
        let indicesLines = [];

        // Normalize a vector and project it onto the sphere.
        function normalize(v) {
            let len = Math.sqrt(
                v[0] * v[0] +
                v[1] * v[1] +
                v[2] * v[2]
            );

            return [
                v[0] / len * radius,
                v[1] / len * radius,
                v[2] / len * radius
            ];
        }

        // Add a vertex and its normal.
        function addVertex(v) {
            let index = vertices.length / 3;

            let p = normalize(v);

            vertices.push(p[0], p[1], p[2]);

            normals.push(
                p[0] / radius,
                p[1] / radius,
                p[2] / radius
            );

            return index;
        }

        // Calculate midpoint of two vertices.
        function midpoint(a, b) {
            return normalize([
                (a[0] + b[0]) / 2,
                (a[1] + b[1]) / 2,
                (a[2] + b[2]) / 2
            ]);
        }

        // Recursively subdivide a triangle.
        function subdivide(a, b, c, level) {

            if (level === 0) {

                let ia = addVertex(a);
                let ib = addVertex(b);
                let ic = addVertex(c);

                indicesTris.push(ia, ib, ic);

                indicesLines.push(
                    ia, ib,
                    ib, ic,
                    ic, ia
                );

                return;
            }

            let ab = midpoint(a, b);
            let bc = midpoint(b, c);
            let ca = midpoint(c, a);

            subdivide(a, ab, ca, level - 1);
            subdivide(ab, b, bc, level - 1);
            subdivide(ca, bc, c, level - 1);
            subdivide(ab, bc, ca, level - 1);
        }

        // Initial octahedron vertices.
        let top    = [0, 1, 0];
        let bottom = [0, -1, 0];

        let front  = [0, 0, 1];
        let back   = [0, 0, -1];

        let left   = [-1, 0, 0];
        let right  = [1, 0, 0];

        // Eight initial triangles.
        let faces = [
            [top, front, right],
            [top, left, front],
            [top, back, left],
            [top, right, back],

            [bottom, right, front],
            [bottom, front, left],
            [bottom, left, back],
            [bottom, back, right]
        ];

        // Subdivide every face.
        for (let face of faces) {
            subdivide(face[0], face[1], face[2], depth);
        }

        // Convert arrays into typed arrays.
        this.vertices = new Float32Array(vertices);
        this.normals = new Float32Array(normals);
        this.indicesTris = new Uint16Array(indicesTris);
        this.indicesLines = new Uint16Array(indicesLines);
    }

    return {
        createVertexData : createVertexData
    };

}());