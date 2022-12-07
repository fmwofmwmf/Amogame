function vertexShader() {
    return `
        attribute vec4 aVertexPosition;
        
        uniform mat4 uModelViewMatrix;
        uniform vec3 uOffset;
        
        varying vec3 scale;
        void main() {
            scale = uOffset;
            gl_Position = (uModelViewMatrix*aVertexPosition) + vec4(uOffset.x, uOffset.y, 0, 0);
        }
    `
}

function fragmentShader() {
    return `
        precision mediump float;
        // Passed in from the vertex shader.
        varying vec3 scale;
        
        // The texture.
        uniform sampler2D u_texture;
        uniform vec2 size;

        void main() {
            gl_FragColor = texture2D(u_texture, 
                vec2(
                    ((gl_FragCoord.x-(size[0] - 200.0*scale.z)/2.0)/(200.0*scale.z)-scale.x/((200.0*scale.z)/size[0]*2.0)),
                    ((gl_FragCoord.y-(size[1] - 200.0*scale.z)/2.0)/(200.0*scale.z)-scale.y/((200.0*scale.z)/size[1]*2.0))
                )
            );
        }
    `
}

class Biomes extends Map {
    constructor(w, h, s, canvas) {
        super(w, h, s, 0, canvas, 'webgl2');
        this.m = [-1,-1]
        this.selected = [-1,-1]
        this.map = newbiome(0,0,this.w, this.h) //biome(this.w, this.h, [1, 2, 3, 4], [30,30,30,30])
    }

    takeimage(box) {
        // this.image = {
        //     L:box.L,
        //     T:box.T,
        //     W:box.W,
        //     H:box.H, 
        //     img:this.ctx.getImageData(0, 0,this.c.width,this.c.height)
        // }
    }

    transform(box, s) { 
        // if (this.image===undefined || this.size!=s) {
        //     this.size = s;
        //     this.newrender(box)
        // } else {
        //     this.ctx.rect(0, 0, this.c.width, this.c.height);
        //     this.ctx.fillStyle = 'grey';
        //     this.ctx.fill();
            
        //     this.ctx.putImageData(this.image.img, Math.round((this.image.L-box.L)*this.size), Math.round((this.image.T-box.T)*this.size),
        //     0, 0, this.c.width, this.c.height)
        this.size = s
        this.partialrender(box, s)
        //     this.takeimage(box)
        // }
    }

    texture() {
        const colors = [[0,255,0,255], [0,255,255,255],[255,255,0,255],[255,0,0,255],[255,255,255,255]]
        let tex = new Array()

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                tex.push(...colors[this.map[i][j]])
            }
        }
        return new Uint8Array(tex)
    }

    partialrender(box, s) {
        let tex = this.texture()

        // Create a texture.
        var texture = this.ctx.createTexture();
        this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

        this.ctx.texImage2D(this.ctx.TEXTURE_2D, 0, this.ctx.RGBA, this.w, this.h, 0, 
            this.ctx.RGBA, this.ctx.UNSIGNED_BYTE, new Uint8Array(tex));

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        const shaderProgram = initShaderProgram(this.ctx, vertexShader(), fragmentShader());

        // Collect all the info needed to use the shader program.
        // Look up which attribute our shader program is using
        // for aVertexPosition and look up uniform locations.
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.ctx.getAttribLocation(shaderProgram, "aVertexPosition"),
            },
            uniformLocations: {
                offset: this.ctx.getUniformLocation(shaderProgram,"uOffset"),
                modelViewMatrix: this.ctx.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                u_texture:this.ctx.getUniformLocation(shaderProgram, "u_texture"),
                size:this.ctx.getUniformLocation(shaderProgram, "size"),
            }
        }

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        this.initBuffers();

        let cameraOffset = { x: -(box.L+box.W/2-this.w/2)*this.size*2, y: (box.T+box.H/2-this.h/2)*this.size*2}
        let cameraZoom = this.size
        console.log(this.map);
        this.drawScene(this.ctx, programInfo, texture, [cameraOffset.x/this.c.width, cameraOffset.y/this.c.height, cameraZoom],
            [this.c.width, this.c.height]);
    }

    drawScene(gl, programInfo, texture, position, size) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
      
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
        const render_offset = new Float32Array(position);

        const modelViewMatrix = mat4.create();

      
        
        mat4.fromScaling(
          modelViewMatrix, // destination matrix
          [(this.w*position[2])/size[0], (this.h*position[2])/size[1], 0.5]
        ); 
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
          const numComponents = 2;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
          );
          gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }
      
        gl.useProgram(programInfo.program);
      
        // Tell WebGL to use our program when drawing
      
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);
      
        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
      
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.u_texture, 0);
      
        // Set the shader uniforms
        
        gl.uniform3fv(
          programInfo.uniformLocations.offset,
          render_offset
        );
        
        gl.uniform2fv(
          programInfo.uniformLocations.size,
          new Uint32Array(size)
        );
      
        gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix
        );
      
        {
          const offset = 0;
          const vertexCount = 4;
          gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
      }

    initBuffers() {
        // Create a buffer for the square's positions.
      
        const positionBuffer = this.ctx.createBuffer();
      
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
      
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, positionBuffer);
      
        // Now create an array of positions for the square.
      
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
      
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
      
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(positions), this.ctx.STATIC_DRAW, [0.1,0.1,0]);
      }

    newrender(box) {
        // const colors = ['lightGrey', 'lightGreen', 'cornsilk', 'darkSeaGreen', 'LawnGreen']
        // let s = []
        // this.ctx.rect(0, 0, this.c.width, this.c.height);
        // this.ctx.fillStyle = 'grey';
        // this.ctx.fill();
        // for (let i = box.align_L; i < box.align_L+box.align_W; i++) {
        //     for (let j = box.align_T; j < box.align_T+box.align_H; j++) {

        //         const x = this.size*(i-box.L), y = this.size*(j-box.T)
        //         if (this.map[i] && this.map[i][j]) {
        //             this.ctx.fillStyle = colors[this.map[i][j]]
        //             this.ctx.fillRect(x, y, this.size, this.size);
        //         }
        //     }
        // }
        // this.takeimage(box)
    }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram)
      );
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }

//const biome_grid = new Biomes(30, 20, 15, document.getElementById('biome-canvas-w1'))
