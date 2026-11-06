let app = ( function() {

	let gl;

	let minusButton;
	let plusButton;
	let recursionLevel;

	// The shader program object is also used to
	// store attribute and uniform locations.
	let prog;
	let icoStep = 0;

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
		distance : 4,
		height : 2
	};

	function start() {
		init();
		render();
	}

	function init() {
		initWebGL();
		initGizmo();
		initShaderProgram();
		initUniforms()
		initModels();
		initEventHandler();
		initPipline();
	}

	function initWebGL() {
		// Get canvas and WebGL context.
		canvas = document.getElementById('canvas');
		gl = canvas.getContext('experimental-webgl');
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}

	function initGizmo() {
		minusButton = document.getElementById("minus-button");
		plusButton = document.getElementById("plus-button");
		recursionLevel = document.getElementById("recursion-level");

		plusButton.addEventListener("click", () => {
			updateIcoSphere(1);
			render();
		});
		minusButton.addEventListener("click", () => {
			updateIcoSphere(-1);
			render();
		});
	}

	/**
	 * Init pipeline parameters that will not change again.
	 * If projection or viewport change, their setup must
	 * be in render function.
	 */
	function initPipline() {
		gl.clearColor(.15, 0, .3, 1);

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
		// Init vertex shader.
		let vs = initShader(gl.VERTEX_SHADER, "vertexshader");
		// Init fragment shader.
		let fs = initShader(gl.FRAGMENT_SHADER, "fragmentshader");
		// Link shader into a shader program.
		prog = gl.createProgram();
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.bindAttribLocation(prog, 0, "aPosition");
		gl.linkProgram(prog);
		gl.useProgram(prog);
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
	}

	function initModels() {

		createModel("icosphere", "fillwireframe", [0.5, icoStep]);
		createModel("torus", "fill", [1.3, 0.07, false]);
		createModel("torus", "fill", [1, 0.07, true]);
		createModel("sphere", "fill", [0.14, 1, 0, 0, 0, 1]);
		createModel("sphere", "fill", [0.14, -1, 0, 0, 0, 1]);
		createModel("sphere", "fill", [0.14, 0, 0, 1, 1, 0]);
		createModel("sphere", "fill", [0.14, 0, 0, -1, 1, 0]);
		createModel("sphere", "fill", [0.14, 0, 1.3, 0, 0, 0]);
		createModel("sphere", "fill", [0.14, 0, -1.3, 0, 0, 0]);
		createModel("sphere", "fill", [0.14, 1.3, 0, 0, 1, 1]);
		createModel("sphere", "fill", [0.14, -1.3, 0, 0, 1, 1]);
		
	}

	/**
	 * Create model object, fill it and push it in models array.
	 * 
	 * @parameter geometryname: string with name of geometry.
	 * @parameter fillstyle: wireframe, fill, fillwireframe.
	 */
 function createModel(geometryname, fillstyle, varArray) {
		let model = {};
		model.fillstyle = fillstyle;
		initDataAndBuffers(model, geometryname, varArray);
		// Create and initialize Model-View-Matrix.
		model.mvMatrix = mat4.create();

		models.push(model);
	}

	/**
	 * Init data and buffers for model object.
	 * 
	 * @parameter model: a model object to augment with data.
	 * @parameter geometryname: string with name of geometry.
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

		// commented out because normals arent used in the shader
		// prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		// gl.enableVertexAttribArray(prog.normalAttrib);

		prog.colorAttrib = gl.getAttribLocation(prog, 'aColor');
		gl.enableVertexAttribArray(prog.colorAttrib);

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
				case('NumpadAdd'):
					updateIcoSphere(1);
					break;
				case('NumpadSubtract'):
					updateIcoSphere(-1);
					break;
			}

			// Render the scene again on any key pressed.
			render();
		};
	}

	function updateIcoSphere(stepDirection) {
		icoStep = Math.max(Math.min(icoStep + stepDirection, 5), 0);
		var model = {};
		model.fillstyle = "fillwireframe";
		initDataAndBuffers(model, "icosphere", [0.5, icoStep]);
		model.mvMatrix = mat4.create();
		models[0] = model;
		recursionLevel.innerHTML = icoStep;
	}

	/**
	 * Run the rendering pipeline.
	 */
	function render() {
		// Clear framebuffer and depth-/z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		setProjection();

		camera.vMatrix = calculateCameraOrbit();

		// Loop over models.
		for(let i = 0; i < models.length; i++) {
			// Update modelview for model.
			mat4.copy(models[i].mvMatrix, camera.vMatrix);

			// Set uniforms for model.
			gl.uniformMatrix4fv(prog.mvMatrixUniform, false,
				models[i].mvMatrix);
			
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
				var v = camera.lrtb;
				mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
				break;
			case("perspective"):
				mat4.perspective(camera.pMatrix, camera.fovy, 1, 0.1, 10);
				break;
		}
		// Set projection uniform.
		gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
	}

	function draw(model) {
		// Setup position VBO.
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
		gl.vertexAttribPointer(prog.positionAttrib,3,gl.FLOAT,false,40,0);
		//gl.vertexAttribPointer(prog.normalAttrib,3,gl.FLOAT,false,40,12);
		gl.vertexAttribPointer(prog.colorAttrib,4,gl.FLOAT,false,40,24);

		// Setup rendering tris.
		let fill = (model.fillstyle.search(/fill/) != -1);
		if(fill) {
			gl.enableVertexAttribArray(prog.colorAttrib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
			gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements,
				gl.UNSIGNED_SHORT, 0);
		}

		// Setup rendering lines.
		let wireframe = (model.fillstyle.search(/wireframe/) != -1);
		if(wireframe) {
			gl.disableVertexAttribArray(prog.colorAttrib);
			gl.vertexAttrib4f(prog.colorAttrib, 1,1,1,1);
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
