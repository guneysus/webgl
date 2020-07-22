"use strict";

const Brush = (function () {
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl");

  const check = function () {
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      return;
    }
  };
  const init = function () {
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  const createShader = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  };

  // https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
  const createProgram = function (gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  };

  const demo1 = function (options) {
    var options = options || {};
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
    var gl = Brush.getGl();

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorUniformLocation = gl.getUniformLocation(program, "u_color");

    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var positions = [
      10, 20,
      80, 20,
      10, 30,
      10, 30,
      80, 20,
      80, 30,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    var opacity = 0.65 + 0.50 * Math.sin(16 * options.frame / 180); // options.opacity || 0.8; // Math.sin(4 * Math.PI * (+new Date % 180.0) / 180.0); // Math.random(); // 0.8;
    var randomize = options.randomize || 0.0;

    for (var i = 0; i <= 20; i++) {
      for (var j = 0; j <= 20; j++) {
        rect(gl, j * 50 + 1, i * 50 + 1, 48, 48); // square borders
        // rect(gl, j * 25, i * 25, 25, 25); // square borders

        // Set a random color.
        var red = i*0.3 * 0.2+ Math.random()*randomize * i;
        var green = 0.2 + Math.random()*randomize*0.8*(10-i); // i * 0.1 + Math.random()*randomize;
        var blue = 0.2 + Math.random()*0.1*randomize;

/*      Color palette   
        var red = j * 0.2+ Math.random()*randomize * i;
        var green = i * 0.1 + Math.random()*randomize;
        var blue = 0.4 + Math.random()*randomize; */

        gl.uniform4f(colorUniformLocation, red, green, blue, opacity);

        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }

    }


  };

  const getGl = function () {
    return gl;
  };

  // Fill the buffer with the values that define a rectangle.
  const rect = function (gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  };

  return {
    check,
    init,
    createShader,
    createProgram,
    demo1,
    getGl,
    rect
  };
})();

function main() {
  Brush.check();
  Brush.demo1();
  var frame = 0;
  setInterval(() =>{
    Brush.init();
    frame++;
    Brush.demo1({
      randomize: 0.005,
      opacity: 0.9,
      frame: frame
    });
  }, 80);
}

window.onload = main;
