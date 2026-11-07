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
				vertices[iVertex * 10 + 6] = 0.15 + ny * 0.15;
				vertices[iVertex * 10 + 7] = 0.1 + ny * 0.15;
				vertices[iVertex * 10 + 8] = 0.15 + ny * 0.05;
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


var sphere = ( function() {

	function createVertexData(radius = 1) {
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
				vertices[iVertex * 10 + 6] = 0.5;
				vertices[iVertex * 10 + 7] = 0.3 + 0.2 * v;
				vertices[iVertex * 10 + 8] = 0.5;
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


var cylinder = (function() {

    function createVertexData(radius = 1, height = 1) {

        let n = 24; // circle verts
        let m = 2;  // line verts

        let r = radius;
        let h = height;

        let sideVertexCount = (n + 1) * (m + 1);
        let capVertexCount = 2 * (n + 1) + 2;

        // Positions, normals and colors.
        this.vertices = new Float32Array(
            10 * (sideVertexCount + capVertexCount)
        );

        let vertices = this.vertices;

        // Index data.
        this.indicesLines = new Uint16Array(
            4 * m * n + 2 * n + 4 * n
        );

        let indicesLines = this.indicesLines;

        this.indicesTris = new Uint16Array(
            6 * m * n + 6 * n
        );

        let indicesTris = this.indicesTris;

        let du = Math.PI * 2 / n;
        let dv = h / m;

        let iLines = 0;
        let iTris = 0;

        // =================================
        // CYLINDER SIDE
        // =================================

        for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {

            for(let j = 0, v = 0; j <= m; j++, v += dv) {

                let iVertex = i * (m + 1) + j;

                let x = r * Math.cos(u);
                let y = v;
                let z = r * Math.sin(u);

                // Position
                vertices[iVertex * 10] = x;
                vertices[iVertex * 10 + 1] = y;
                vertices[iVertex * 10 + 2] = z;

                // Normal
                let nx = Math.cos(u);
                let ny = 0;
                let nz = Math.sin(u);

                vertices[iVertex * 10 + 3] = nx;
                vertices[iVertex * 10 + 4] = ny;
                vertices[iVertex * 10 + 5] = nz;

                // Color
                vertices[iVertex * 10 + 6] = 0.4;
                vertices[iVertex * 10 + 7] = 0.3;
                vertices[iVertex * 10 + 8] = 0.1;
                vertices[iVertex * 10 + 9] = 1;

                // Lines
                if(j > 0 && i > 0) {

                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                }

                if(i > 0) {

                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Triangles
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

        // =================================
        // CAPS
        // =================================

        function createCap(y, normalY, isTop) {

            let startIndex = vertices.length / 10;
            // Use the actual side vertex count as the cap offset.
            startIndex = sideVertexCount +
                (isTop ? n + 2 : 0);

            // Circumference vertices
            for(let i = 0; i <= n; i++) {

                let u = -Math.PI + i * du;

                let x = r * Math.cos(u);
                let z = r * Math.sin(u);

                let iVertex = startIndex + i;

                // Position
                vertices[iVertex * 10] = x;
                vertices[iVertex * 10 + 1] = y;
                vertices[iVertex * 10 + 2] = z;

                // Normal
                vertices[iVertex * 10 + 3] = 0;
                vertices[iVertex * 10 + 4] = normalY;
                vertices[iVertex * 10 + 5] = 0;

                // Color
                vertices[iVertex * 10 + 6] = 0.4;
                vertices[iVertex * 10 + 7] = 0.3;
                vertices[iVertex * 10 + 8] = 0.1;
                vertices[iVertex * 10 + 9] = 1;
            }

            // Center vertex
            let centerIndex = startIndex + n + 1;

            vertices[centerIndex * 10] = 0;
            vertices[centerIndex * 10 + 1] = y;
            vertices[centerIndex * 10 + 2] = 0;

            vertices[centerIndex * 10 + 3] = 0;
            vertices[centerIndex * 10 + 4] = normalY;
            vertices[centerIndex * 10 + 5] = 0;

            vertices[centerIndex * 10 + 6] = 0.4;
            vertices[centerIndex * 10 + 7] = 0.3;
            vertices[centerIndex * 10 + 8] = 0.1;
            vertices[centerIndex * 10 + 9] = 1;

            // Triangle fan
            for(let i = 0; i < n; i++) {

                let a = startIndex + i;
                let b = startIndex + i + 1;

                if(isTop) {

                    indicesTris[iTris++] = centerIndex;
                    indicesTris[iTris++] = b;
                    indicesTris[iTris++] = a;

                } else {

                    indicesTris[iTris++] = centerIndex;
                    indicesTris[iTris++] = a;
                    indicesTris[iTris++] = b;
                }

                // Cap circumference lines
                indicesLines[iLines++] = a;
                indicesLines[iLines++] = b;
            }
        }

        // Bottom cap
        createCap(0, -1, false);

        // Top cap
        createCap(h, 1, true);
    }

    return {
        createVertexData: createVertexData
    };

}());



var cone = (function() {

    function createVertexData(radius = 1, height = 1) {

        let n = 24; // circle verts
        let m = 2;  // height subdivisions

        let r = radius;
        let h = height;

        let sideVertexCount = (n + 1) * (m + 1);
        let capVertexCount = n + 2;

        // Positions, normals and colors.
        this.vertices = new Float32Array(
            10 * (sideVertexCount + capVertexCount)
        );

        let vertices = this.vertices;

        // Index data.
        this.indicesLines = new Uint16Array(
            4 * m * n + 2 * n + 2 * n
        );

        let indicesLines = this.indicesLines;

        this.indicesTris = new Uint16Array(
            6 * m * n + 3 * n
        );

        let indicesTris = this.indicesTris;

        let du = Math.PI * 2 / n;
        let dv = h / m;

        let iLines = 0;
        let iTris = 0;

        // =================================
        // CONE SIDE
        // =================================

        for(let i = 0, u = -Math.PI; i <= n; i++, u += du) {

            for(let j = 0, v = 0; j <= m; j++, v += dv) {

                let iVertex = i * (m + 1) + j;

                let currentRadius = r * (1 - v / h);

                let x = currentRadius * Math.cos(u);
                let y = v;
                let z = currentRadius * Math.sin(u);

                // Position
                vertices[iVertex * 10] = x;
                vertices[iVertex * 10 + 1] = y;
                vertices[iVertex * 10 + 2] = z;

                // Normal
                let nx = h * Math.cos(u);
                let ny = r;
                let nz = h * Math.sin(u);

                let length = Math.sqrt(
                    nx * nx + ny * ny + nz * nz
                );

                nx /= length;
                ny /= length;
                nz /= length;

                vertices[iVertex * 10 + 3] = nx;
                vertices[iVertex * 10 + 4] = ny;
                vertices[iVertex * 10 + 5] = nz;

                // Color
                vertices[iVertex * 10 + 6] =  0;
                vertices[iVertex * 10 + 7] =  0.4 * (1 - currentRadius / r) + 0.3;
                vertices[iVertex * 10 + 8] = 0.45;
                vertices[iVertex * 10 + 9] = 1;

                // Lines
                if(j > 0 && i > 0) {

                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                }

                if(i > 0) {

                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Triangles
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

        // =================================
        // BOTTOM CAP
        // =================================

        let startIndex = sideVertexCount;

        // Circumference vertices
        for(let i = 0; i <= n; i++) {

            let u = -Math.PI + i * du;

            let x = r * Math.cos(u);
            let z = r * Math.sin(u);

            let iVertex = startIndex + i;

            // Position
            vertices[iVertex * 10] = x;
            vertices[iVertex * 10 + 1] = 0;
            vertices[iVertex * 10 + 2] = z;

            // Normal
            vertices[iVertex * 10 + 3] = 0;
            vertices[iVertex * 10 + 4] = -1;
            vertices[iVertex * 10 + 5] = 0;

            // Color
            vertices[iVertex * 10 + 6] = 0;
            vertices[iVertex * 10 + 7] = 0.3;
            vertices[iVertex * 10 + 8] = 0.45;
            vertices[iVertex * 10 + 9] = 1;
        }

        // Center vertex
        let centerIndex = startIndex + n + 1;

        vertices[centerIndex * 10] = 0;
        vertices[centerIndex * 10 + 1] = 0;
        vertices[centerIndex * 10 + 2] = 0;

        vertices[centerIndex * 10 + 3] = 0;
        vertices[centerIndex * 10 + 4] = -1;
        vertices[centerIndex * 10 + 5] = 0;

        vertices[centerIndex * 10 + 6] = 0;
        vertices[centerIndex * 10 + 7] = 0.1;
        vertices[centerIndex * 10 + 8] = 0.2;
        vertices[centerIndex * 10 + 9] = 1;

        // Triangle fan
        for(let i = 0; i < n; i++) {

            let a = startIndex + i;
            let b = startIndex + i + 1;

            indicesTris[iTris++] = centerIndex;
            indicesTris[iTris++] = a;
            indicesTris[iTris++] = b;

            // Cap circumference lines
            indicesLines[iLines++] = a;
            indicesLines[iLines++] = b;
        }
    }

    return {
        createVertexData: createVertexData
    };

}());



var ground = ( function() {

	function createVertexData(radius = 2) {
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

				let x = r * Math.sin(v) * Math.cos(u);
				let y = r * Math.cos(v) / 5;
				let z = r * Math.sin(v) * Math.sin(u);

				// Set vertex positions.
				vertices[iVertex * 10] = x;
				vertices[iVertex * 10 + 1] = y;
				vertices[iVertex * 10 + 2] = z;

				// Calc and set normals.
				let nx = x / r;
				let ny = y / r;
				let nz = z / r;
				let vertexLength = Math.sqrt(nx * nx + ny * ny + nz * nz);
				vertices[iVertex * 10 + 3] = nx / vertexLength;
				vertices[iVertex * 10 + 4] = ny / vertexLength;
				vertices[iVertex * 10 + 5] = nz / vertexLength;

				// set vertex colors
				vertices[iVertex * 10 + 6] = 0.2;
				vertices[iVertex * 10 + 7] = 0.8 - v * 0.4;
				vertices[iVertex * 10 + 8] = 0.5;
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