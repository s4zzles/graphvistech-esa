let app = ( function() {

	let gl;

	// The shader program object is also used to
	// store attribute and uniform locations.
	let prog;
	let progGouraud;
	let progPhong;
	let progToon;

	let amount = 6.;

	// Array of model objects.
	let models = [];

	let camera = {
		// Initial position of the camera.
		eye : [0, 1, 4],
		// Point to look at.
		center : [0, 0, 0],
		// Roll and pitch of the camera.
		up : [0, 1, 0],
		// Opening angle given in radian.
		// radian = degree*2*PI/360.
		fovy : 45.0 * Math.PI / 180,
		// Camera near plane dimensions:
		// value for left right top bottom in projection.
		lrtb : 2.0,
		// View matrix.
		vMatrix : mat4.create(),
		// Projection matrix.
		pMatrix : mat4.create(),
		// Projection types: ortho, perspective, frustum.
		projectionType : "perspective",
		// Angle to Z-Axis for camera when orbiting the center
		// given in radian.
		zAngle : 0,
		// Distance in XZ-Plane from center when orbiting.
		distance : 3.5,
		height : 1
	};

	// Object with light sources characteristics in the scene.
    let illumination = {
        ambientLight : [ .5, .5, .5],
        light : [ {
            isOn : true,
            position : [ 0., 1., 0.],
            color : [ .4, .4, .7],
			orbitAngle : Math.PI
        },
		{
			isOn : true,
			position : [0, -1, 0],
			color : [.5, .2, 0.],
			orbitAngle : 0
		},
		]
    };

	function start() {
		init();
		render(true, 1);
	}

	function init() {
		initWebGL();
		initShaderProgram();
		initUniforms();
		initModels();
		initEventHandler();
		initPipeline();
	}

	function initWebGL() {
		// Get canvas and WebGL context.
		canvas = document.getElementById('canvas');
		gl = canvas.getContext('experimental-webgl');
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}

	/**
	 * Init pipeline parameters that will not change again.
	 * If projection or viewport change, their setup must
	 * be in render function.
	 */
	function initPipeline() {
		gl.clearColor(0.4, .6, .9, 1);

		// Backface culling.
		gl.frontFace(gl.CCW);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		// Depth(Z)-Buffer.
		gl.enable(gl.DEPTH_TEST);

		// Polygon offset of rastered Fragments.
		gl.enable(gl.POLYGON_OFFSET_FILL);
		gl.polygonOffset(0.5, 0);

		// Set viewport.
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

		// Init camera.
		// Set projection aspect ratio.
		camera.aspect = gl.viewportWidth / gl.viewportHeight;
	}

	function initShaderProgram() {

		// Init vertex shaders
		let vsGouraud = initShader(gl.VERTEX_SHADER, "vertexshader-gouraud");
		let vsPhong = initShader(gl.VERTEX_SHADER, "vertexshader-phong");

		// Init fragment shaders
		let fsGouraud = initShader(gl.FRAGMENT_SHADER, "fragmentshader-gouraud");
		let fsPhong = initShader(gl.FRAGMENT_SHADER, "fragmentshader-phong");
		let fsToon = initShader(gl.FRAGMENT_SHADER, "fragmentshader-toon");

		// Create programs
		progGouraud = createProgram(vsGouraud, fsGouraud);
		progPhong = createProgram(vsPhong, fsPhong);
		progToon = createProgram(vsPhong, fsToon);

		prog = progPhong;
		gl.useProgram(prog);
	}

	function createProgram(vs, fs) {

		let program = gl.createProgram();

		gl.attachShader(program, vs);
		gl.attachShader(program, fs);

		gl.bindAttribLocation(program, 0, "aPosition");

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log(gl.getProgramInfoLog(program));
			return null;
		}

		return program;
	}

	function switchShader(newProgram) {

		prog = newProgram;

		gl.useProgram(prog);

		initUniforms();
		prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
		prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		prog.textureCoordAttrib = gl.getAttribLocation(prog, 'aTextureCoord');

		render();
	}

	/**
	 * Create and init shader from source.
	 * 
	 * @parameter shaderType: openGL shader type.
	 * @parameter SourceTagId: Id of HTML Tag with shader source.
	 * @returns shader object.
	 */
	function initShader(shaderType, SourceTagId) {
		let shader = gl.createShader(shaderType);
		let shaderSource = document.getElementById(SourceTagId).text;
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(SourceTagId+": "+gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	function initUniforms() {
		// Projection Matrix.
		prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

		// Model-View-Matrix.
		prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");

		// Normal-Matrix
		prog.nMatrixUniform = gl.getUniformLocation(prog, "uNMatrix");

        // Light.
        prog.ambientLightUniform = gl.getUniformLocation(prog,
                "ambientLight");
        // Array for light sources uniforms.
        prog.lightUniform = [];
        // Loop over light sources.
        for (let j = 0; j < illumination.light.length; j++) {
            let lightNb = "light[" + j + "]";
            // Store one object for every light source.
            let l = {};
            l.isOn = gl.getUniformLocation(prog, lightNb + ".isOn");
            l.position = gl.getUniformLocation(prog, lightNb + ".position");
            l.color = gl.getUniformLocation(prog, lightNb + ".color");
            prog.lightUniform[j] = l;
        }

        // Material.
        prog.materialKaUniform = gl.getUniformLocation(prog, "material.ka");
        prog.materialKdUniform = gl.getUniformLocation(prog, "material.kd");
        prog.materialKsUniform = gl.getUniformLocation(prog, "material.ks");
        prog.materialKeUniform = gl.getUniformLocation(prog, "material.ke");

		// Texture.
        prog.textureUniform = gl.getUniformLocation(prog, "uTexture");
		prog.amountUniform = gl.getUniformLocation(prog, "uAmount");
	}

	function initTexture(model, filename) {
        var texture = gl.createTexture();
        model.texture = texture;
        texture.loaded = false;
        texture.image = new Image();
        texture.image.onload = function() {
            onloadTextureImage(texture);
        };
        texture.image.src = filename;
    }

    function onloadTextureImage(texture) {

        texture.loaded = true;

        // Use texture object.
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Assigen image data.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                texture.image);

        // Set texture parameter.
        // Min Filter: NEAREST,LINEAR, .. , LINEAR_MIPMAP_LINEAR,
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Mag Filter: NEAREST,LINEAR
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Use mip-Mapping.
        gl.generateMipmap(gl.TEXTURE_2D);

        // Release texture object.
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Update the scene.
        render();
    }

	

	/**
     * @paramter material : objekt with optional ka, kd, ks, ke.
     * @retrun material : objekt with ka, kd, ks, ke.
     */
    function createPhongMaterial(material) {
        material = material || {};
        // Set some default values,
        // if not defined in material parameter.
        material.ka = material.ka || [ 0.3, 0.3, 0.3 ];
        material.kd = material.kd || [ 0.6, 0.6, 0.6 ];
        material.ks = material.ks || [ 0.8, 0.8, 0.8 ];
        material.ke = material.ke || 10.;

        return material;
    }

	function initModels() {

		// Create some default material.
        let mDefault = createPhongMaterial();

		let mWhite = createPhongMaterial({ka: [ 1., 1., 1. ],kd: [ 1., 1., 1. ], ks: [0.2,0.2,0.2]});


		createModel("torus", "fill", [0.275, 0, 0], [Math.PI / 4, 0, 0], [1, 1, 1], [0.55, 0.25], mWhite);
		createModel("torus", "fill", [-0.275, 0, 0], [-Math.PI / 4, 0, 0], [1, 1, 1], [0.55, 0.25], mWhite,
			"textures/donut.png"
		);
		createModel("plane", "fill", [0, -0.7, 0], [0, 0, 0], [1, 1, 1], [3,3], mWhite, 
			"textures/Grass_basecolor1.png"
		);
	}

	/**
	 * Create model object, fill it and push it in models array.
	 * 
	 * @parameter geometryname: string with name of geometry.
	 * @parameter fillstyle: wireframe, fill, fillwireframe.
	 */
    function createModel(geometryname, fillstyle, translate, rotate, scale, varArray, material, 
		textureFilename) {
		let model = {};
		model.fillstyle = fillstyle;
		model.geometryname = geometryname;
		initDataAndBuffers(model, geometryname, varArray);
		initTransformations(model, translate, rotate, scale);

		if (textureFilename) {
            initTexture(model, textureFilename);
        }

		model.material = material;

		models.push(model);
	}

	function initTransformations(model, translate, rotate, scale) {
		// Store transformation vectors.
		model.translate = translate;
		model.rotate = rotate;
		model.scale = scale;
		model.orbitAngle = 0; // WIP

		// Create and initialize Model-Matrix.
		model.mMatrix = mat4.create();

		// Create and initialize Model-View-Matrix.
		model.mvMatrix = mat4.create();

		// Create and initialize Normal-Matrix.
		model.nMatrix = mat3.create();
	}


	/**
	 * Init data and buffers for model object.
	 * 
	 * @parameter model: a model object to augment with data.
	 * @parameter geometryname: string with name of geometry.
	 * @parameter varArray: array with variables that are used to parametrize the form of the model
	 */
	function initDataAndBuffers(model, geometryname, varArray) {
		// Provide model object with vertex data arrays.
		// Fill data arrays for Vertex-Positions, Normals, Index data:
		// vertices, normals, indicesLines, indicesTris;
		// Pointer this refers to the window.
		this[geometryname]['createVertexData'].apply(model, varArray);
		

		// Setup position vertex buffer object.
		model.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);

		// Bind vertex buffer to attribute variables
		prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
		gl.enableVertexAttribArray(prog.positionAttrib);

		prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		gl.enableVertexAttribArray(prog.normalAttrib);

		prog.textureCoordAttrib = gl.getAttribLocation(prog, 'aTextureCoord');
		gl.enableVertexAttribArray(prog.textureCoordAttrib);

		// Setup lines index buffer object.
		model.iboLines = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines,
			gl.STATIC_DRAW);
		model.iboLines.numberOfElements = model.indicesLines.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// Setup triangle index buffer object.
		model.iboTris = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris,
			gl.STATIC_DRAW);
		model.iboTris.numberOfElements = model.indicesTris.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	function initEventHandler() {

		window.onkeydown = function(event) {
			let sign = event.shiftKey ? -1 : 1;
			let animate = false;

			// Change projection of scene.
			switch(event.code) {
				case('KeyO'):
					camera.projectionType = "ortho";
					camera.lrtb = 2;
					break;
				case('KeyP'):
					camera.projectionType = "perspective";
					break;
				case('ArrowRight'):
					deltaAngle = Math.PI * 2 / 180;
					camera.zAngle += deltaAngle;
					camera.zAngle %= Math.PI * 2;
					break;
				case('ArrowLeft'):
					deltaAngle = Math.PI * 2 / 180;
					camera.zAngle -= deltaAngle;
					camera.zAngle %= Math.PI * 2;
					break;
				case('KeyN'):
					camera.distance *= 1 - 0.05 * sign;
					break;
				case('ArrowUp'):
					event.preventDefault();
					camera.height += 0.1;
					break;
				case('ArrowDown'):
					event.preventDefault();
					camera.height -= 0.1;
					break;
				case('KeyI'):
					animate = true;
					sign = 1;
					break;
				case('KeyL'):
					animate = true;
					sign = -1;
					break;
				case('KeyT'):
					switchShader(progToon);
					break;
				case('KeyG'):
					switchShader(progGouraud);
					break;
				case('KeyH'):
					switchShader(progPhong);
					break;
				case('KeyW'):
					amount += 0.025;
					break;
				case('KeyQ'):
					amount -= 0.025;
					break;
			}

			// Render the scene again on any key pressed.
			render(animate, sign);
		};
	}

	// use this for light rotations
	function orbit(light, center, radius, offset, degree, sign) {
		let orbitAngle = light.orbitAngle;
		let delta = (Math.PI * 2 / 360) * degree * sign;
		orbitAngle = (orbitAngle + delta) % (Math.PI * 2);


		// orbit on XZ plane in local space
		light.position = [
			radius * Math.cos(orbitAngle + offset), 
			0, 
			radius * Math.sin(orbitAngle + offset)
		];

		// add center array to translate
		light.position = light.position.map((value, i) => value + center[i]);

		light.orbitAngle = orbitAngle;
	}


	/**
	 * Run the rendering pipeline.
	 */
	function render(animate, sign) {
		// Clear framebuffer and depth-/z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		setProjection();

		camera.vMatrix = calculateCameraOrbit();

        // Set light uniforms.
        gl.uniform3fv(prog.ambientLightUniform, illumination.ambientLight);
        // Loop over light sources.
        for (let j = 0; j < illumination.light.length; j++) {
            // bool is transferred as integer.
            gl.uniform1i(prog.lightUniform[j].isOn,
                    illumination.light[j].isOn);
            
			// animate lights in orbit
			if(animate) {
				 let s = j == 0 ? 1 : -1;
				let l = illumination.light[j];
				orbit(l, [0, 0.75 * s, 0], 1, 0, 5, sign);
			}
			

            let lightPos = [].concat(illumination.light[j].position);
            // Add homogenious coordinate for transformation.
            lightPos.push(1.0);
            vec4.transformMat4(lightPos, lightPos, camera.vMatrix);
            // Remove homogenious coordinate.
            lightPos.pop();
            gl.uniform3fv(prog.lightUniform[j].position, lightPos);
            gl.uniform3fv(prog.lightUniform[j].color,
                    illumination.light[j].color);
        }

		// Loop over models.
		for(let i = 0; i < models.length; i++) {
			
			// Update modelview for model.
			updateTransformations(models[i]);

			// Set uniforms for model.
			gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
				models[i].mvMatrix);

			gl.uniformMatrix3fv(prog.nMatrixUniform, false,
                models[i].nMatrix);

			// Material.
			gl.uniform3fv(prog.materialKaUniform, models[i].material.ka);
			gl.uniform3fv(prog.materialKdUniform, models[i].material.kd);
			gl.uniform3fv(prog.materialKsUniform, models[i].material.ks);
			gl.uniform1f(prog.materialKeUniform, models[i].material.ke);  
			// Texture.
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, models[i].texture);
            gl.uniform1i(prog.textureUniform, 0);
			gl.uniform1f(prog.amountUniform, amount);
			
			draw(models[i]);
		}
	}

	function calculateCameraOrbit() {
		let camTrajectory = [camera.distance * Math.sin(camera.zAngle), camera.height,
			camera.distance * Math.cos(camera.zAngle)];
		let out = mat4.create();
		out = mat4.lookAt(out, camTrajectory, camera.center, camera.up);
		return out;
	}

	function setProjection() {
		// Set projection Matrix.
		switch(camera.projectionType) {
			case("ortho"):
				let v = camera.lrtb;
				mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
				break;
			case("perspective"):
				mat4.perspective(camera.pMatrix, camera.fovy, 1, 0.1, 10);
				break;
		}
		// Set projection uniform.
		gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
	}

	/**
	 * Update model-view matrix for model.
	 */
	function updateTransformations(model) {
	
		// Use shortcut variables.
		let mMatrix = model.mMatrix;
		let mvMatrix = model.mvMatrix;
		let nMatrix = model.nMatrix;

		// Reset matrices to identity.
        mat4.identity(mMatrix);
        mat4.identity(mvMatrix);

		// Translate.
        mat4.translate(mMatrix, mMatrix, model.translate);

		// Rotate
		mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);
		mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
		mat4.rotateX(mMatrix, mMatrix, model.rotate[0]);

		// Scale
        mat4.scale(mMatrix, mMatrix, model.scale);

		// Combine view and model matrix
        // by matrix multiplication to mvMatrix.        
        mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);

		// Calculate normal matrix from model-view matrix.
        mat3.normalFromMat4(nMatrix, mvMatrix);
				
	}

	function draw(model) {
		// Setup VBO
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
		gl.vertexAttribPointer(prog.positionAttrib,3,gl.FLOAT,false,48,0);
		gl.vertexAttribPointer(prog.normalAttrib,3,gl.FLOAT,false,48,12);
		gl.vertexAttribPointer(prog.textureCoordAttrib,3,gl.FLOAT,false,48,40);

		// Setup rendering tris.
		let fill = (model.fillstyle.search(/fill/) != -1);
		if(fill) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
			gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
				gl.UNSIGNED_SHORT, 0);
		}

		// Setup rendering lines.
		let wireframe = (model.fillstyle.search(/wireframe/) != -1);
		if(wireframe) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
			gl.drawElements(gl.LINES, model.iboLines.numberOfElements,
				gl.UNSIGNED_SHORT, 0);
		}
	}

	// App interface.
	return {
		start : start
	}

}());
