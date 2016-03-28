"use strict";

var canvas;
var gl;
var myCube;
var program;

var NumVertices = 36;

var near = -1;
var far = 1;
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;


var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

window.onload = function init(){
//    try {
        // get the canvas
        canvas = document.getElementById( "gl-canvas" );

        // setup the canvas
        gl = WebGLUtils.setupWebGL( canvas );
        if ( !gl ) { alert( "WebGL isn't available" ); }

        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
        gl.enable(gl.DEPTH_TEST);

        // make the cube
        myCube = cube(1);

        // get the canvas and set up the program
        program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        // create a buffer to start loading the data onto the GPU
        console.log(myCube.TriangleVertices);  // debugging line
        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(myCube.TriangleVertexColors), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(myCube.TriangleVertices), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        // Draw it
        //gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
        render();
//    } catch (e) {
//      alert("Could not initialize WebGL! " + e);
//      return;
//   }
}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
        eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

        mvMatrix = lookAt(eye, at , up); 
        pMatrix = ortho(left, right, bottom, ytop, near, far);
        
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
            
        gl.drawArrays( gl.TRIANGLES, 0, myCube.TriangleVertices.length );
        requestAnimFrame(render);
}
