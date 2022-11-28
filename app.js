"use strict";

var vs = `#version 300 es

in vec4 a_position;
in vec3 a_normal;

//lightworld duplicado
uniform vec3 u_lightWorldPosition;
uniform vec3 u_lightWorldPosition2;
uniform vec3 u_lightWorldPosition3;
uniform vec3 u_lightWorldPosition4;

uniform vec3 u_viewWorldPosition;

uniform mat4 u_matrix;
uniform mat4 u_world;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;

//duplicados surface to light e view
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

out vec3 v_surfaceToLight2;
out vec3 v_surfaceToView2;
out vec3 v_surfaceToLight3;
out vec3 v_surfaceToView3;
out vec3 v_surfaceToLight4;
out vec3 v_surfaceToView4;

void main() {

  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight2 = u_lightWorldPosition2 - surfaceWorldPosition;
  v_surfaceToView2 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight3 = u_lightWorldPosition3 - surfaceWorldPosition;
  v_surfaceToView3 = u_viewWorldPosition - surfaceWorldPosition;

  v_surfaceToLight3 = u_lightWorldPosition3 - surfaceWorldPosition;
  v_surfaceToView3 = u_viewWorldPosition - surfaceWorldPosition;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 v_normal;

//duplicados
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

in vec3 v_surfaceToLight2;
in vec3 v_surfaceToView2;
in vec3 v_surfaceToLight3;
in vec3 v_surfaceToView3;
in vec3 v_surfaceToLight4;
in vec3 v_surfaceToView4;


uniform vec4 u_color;

uniform float u_shininess;

//duplicados
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

uniform vec3 u_lightColor2;
uniform vec3 u_specularColor2;
uniform vec3 u_lightColor3;
uniform vec3 u_specularColor3;
uniform vec3 u_lightColor4;
uniform vec3 u_specularColor4;

out vec4 outColor;

void main() {

  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);

  vec3 surfaceToLightDirection2 = normalize(v_surfaceToLight2);
  vec3 surfaceToViewDirection2 = normalize(v_surfaceToView2);
  vec3 surfaceToLightDirection3 = normalize(v_surfaceToLight3);
  vec3 surfaceToViewDirection3 = normalize(v_surfaceToView3);
  vec3 surfaceToLightDirection4 = normalize(v_surfaceToLight4);
  vec3 surfaceToViewDirection4 = normalize(v_surfaceToView4);

  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
  vec3 halfVector2 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);
  vec3 halfVector3 = normalize(surfaceToLightDirection3 + surfaceToViewDirection3);
  vec3 halfVector4 = normalize(surfaceToLightDirection4 + surfaceToViewDirection4);

  float light = dot(normal, surfaceToLightDirection);
  float light2 = dot(normal, surfaceToLightDirection2);
  float light3 = dot(normal, surfaceToLightDirection3);
  float light4 = dot(normal, surfaceToLightDirection4);

  float specular = 0.0;
  float specular2 = 0.0;
  float specular3 = 0.0;
  float specular4 = 0.0;

  vec3 color;
  vec3 color2;
  vec3 color3;
  vec3 color4;

  vec3 spec;
  vec3 spec2;
  vec3 spec3;
  vec3 spec4;

  specular = pow(dot(normal, halfVector), u_shininess);
  specular2 = pow(dot(normal, halfVector2), u_shininess);
  specular3 = pow(dot(normal, halfVector3), u_shininess);
  specular4 = pow(dot(normal, halfVector4), u_shininess);

  if (light > 0.0) {
    color = light * u_lightColor;
    spec = specular * u_specularColor;

  }
  if (light2 > 0.0) {
    color2 = light2 * u_lightColor2;
    spec2 = specular2 * u_specularColor2;
  }
  if (light3 > 0.0) {
    color3 = light3 * u_lightColor3;
    spec3 = specular3 * u_specularColor3;
  }
  if (light4 > 0.0) {
    color4 = light4 * u_lightColor4;
    spec4 = specular4 * u_specularColor4;
  }

  outColor = u_color;
  outColor.rgb *= (color + color2 + color3 + color4);
  outColor.rgb += (spec + spec2 + spec3 + spec4);
}
`;

var TRS = function() {
  this.translation = [0, 0, 0];
  this.rotation = [0, 0, 0];
  this.scale = [1, 1, 1];
  this.index = 0;
  this.type = 'p';
};

TRS.prototype.getMatrix = function(dst) {
  dst = dst || new Float32Array(16);
  var t = this.translation;
  var r = this.rotation;
  var s = this.scale;
  var i = this.index;
  var ty = this.type;

  // compute a matrix from translation, rotation, and scale
  m4.translation(t[0], t[1], t[2], dst);
  m4.xRotate(dst, r[0], dst);
  m4.yRotate(dst, r[1], dst);
  m4.zRotate(dst, r[2], dst);
  m4.scale(dst, s[0], s[1], s[2], dst);
  return dst;
};

var Node = function (source) {
  this.children = [];
  this.localMatrix = m4.identity();
  this.worldMatrix = m4.identity();
  this.source = source;
};

Node.prototype.setParent = function (parent) {
  // remove us from our parent
  if (this.parent) {
    var ndx = this.parent.children.indexOf(this);
    if (ndx >= 0) {
      this.parent.children.splice(ndx, 1);
    }
  }

  // Add us to our new parent
  if (parent) {
    parent.children.push(this);
  }
  this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (matrix) {
  var source = this.source;
  if (source) {
    source.getMatrix(this.localMatrix);
  }

  if (matrix) {
    // a matrix was passed in so do the math
    m4.multiply(matrix, this.localMatrix, this.worldMatrix);
  } else {
    // no matrix was passed in so just copy.
    m4.copy(this.localMatrix, this.worldMatrix);
  }

  // now process all the children
  var worldMatrix = this.worldMatrix;
  this.children.forEach(function (child) {
    child.updateWorldMatrix(worldMatrix);
  });
};
var playerPosition = {
  x: 0,
  y: 0,
}

var bgm;
var deathSound = new Audio('sfx/death.mp3');
var shootSound = new Audio('sfx/shoot.mp3');
var hitSound = new Audio('sfx/hit.mp3');

deathSound.volume = 0.5;
shootSound.volume = 0.8;

var projectileAlive = false;
var enemyProjectile1Alive = false;
var enemyProjectile2Alive = false;

var playerLive = 3;
var barrierLife = [3,3,3,3];
var level = 1;
var numberOfEnemys = 21;

var animationTime = 0;

var then = 0;
var mouseThen = 0;
var mouseNow = 0;
var levelAnimationTime = 0;
var texture;

var cubeVAO;
var cubeBufferInfo;
var sphereVAO;
var sphereBufferInfo;
var sphere;
var spaceInvaderVAO;
var spaceBufferInfo;


var objectsToDraw = [];
var objects = [];
var nodeInfosByName = {};
var scene;
var objeto = {};
var programInfo;
var programInfoWireframe;
var programInfoTexture;
var gl;

var speed = 1;
var animationRegulator;

var gameOver = false;

//CAMERA VARIABLES
var cameras = [{
  cameraPosition: [0, 0, 30],
  target: [0,0,0],
  up: [0, 1, 0],
},
{
  cameraPosition: [3,-2,4],
  target: [0,0,0],
  up: [0, 1, 0],
},
{
  cameraPosition: [-2,1,4],
  target: [0,0,0],
  up: [0, 1, 0],
}
];

function makeNode(nodeDescription) {
  var trs = new TRS();
  var node = new Node(trs);
  nodeInfosByName[nodeDescription.name] = {
    trs: trs,
    node: node,
  };
  trs.translation = nodeDescription.translation || trs.translation;
  if (nodeDescription.draw !== false) {
    node.drawInfo = {
      uniforms: {
        //u_color: [0.2, 1, 0.2, 1],
      },
      programInfo: programInfo,
      bufferInfo: nodeDescription.bufferInfo,
      vertexArray: nodeDescription.vao,
    };
    objectsToDraw.push(node.drawInfo);
    objects.push(node);
  }
  makeNodes(nodeDescription.children).forEach(function (child) {
    child.setParent(node);
  });
  return node;
}

function makeNodes(nodeDescriptions) {
  return nodeDescriptions ? nodeDescriptions.map(makeNode) : [];
}

const calculateBarycentric = (length) => {
  const n = length / 6;
  const barycentric = [];
  for (let i = 0; i < n; i++) barycentric.push(1, 0, 0, 0, 1, 0, 0, 0, 1);
  return barycentric;
};


function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  level = Math.floor(Math.random() * 5) + 1;

  if(level % 2 == 0) {
    bgm = new Audio('sfx/bgm2.mp3');
  }
  else {
    bgm = new Audio('sfx/bgm.mp3');
  }
  
  bgm.volume = 0.2;

  for(let i = 0; i < 540; i++) {
    spaceInvader_data.indices.push(i);
  }

  //Calcula a normal dos objetos para inicialização:
  arrays_cube.normal = calculateNormal(arrays_cube.position, arrays_cube.indices);
  arrays_cube.barycentric = calculateBarycentric(arrays_cube.position.length);
  spaceInvader_data.normal = calculateNormal(spaceInvader_data.position, spaceInvader_data.indices);

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  //cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 1);

  cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, arrays_cube);
  spaceBufferInfo = twgl.createBufferInfoFromArrays(gl, spaceInvader_data);

  sphere = twgl.primitives.createSphereVertices(1,16,16);
  sphereBufferInfo = twgl.createBufferInfoFromArrays(gl, sphere);

  // setup GLSL program
  programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);
  sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
  spaceInvaderVAO = twgl.createVAOFromBufferInfo(gl, programInfo, spaceBufferInfo);


  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};
    
  // Let's make all the nodes
  objeto = {
    name: "scene",
    draw: false,
    children: [{
        name: "player",
        draw: false,
        children: [],
    },
    {
        name: "barrier",
        draw: false,
        children: [],
    },
    {
        name: "enemy",
        draw: false,
        children: [],
    },
    {
      name: "projectile",
      draw: false,
      children: [],
    },
    {
      name: "enemyProjectiles",
      draw: false,
      children: [],
    },
    {
      name: "enemyProjectiles2",
      draw: false,
      children: [],
    },
  ] 
  };

  //createObj("pyramid");
  
  //scene = makeNode(objeto);

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  createGame();
  
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(now) {
    if(!gameOver) {

      now *= 0.001;
      var deltaTime = now - then;
      animationTime += deltaTime;
      levelAnimationTime += deltaTime;
      then = now;
      
      var mouseOffset = 0.47;

      if(mousePositionXNormalized) {
          mouseNow = mousePositionXNormalized - mouseOffset;
      }

      var deltaMouse = mouseNow - mouseThen;
      mouseThen = mouseNow;
      
      twgl.resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.disable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000); //FOV, aspectRatio, NearPlane, FarPlane

      // Compute the camera's matrix using look at.
      var cameraMatrix = m4.lookAt(cameras[0].cameraPosition, cameras[0].target, cameras[0].up);

      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
      
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
      
      var fRotationRadians = degToRad(0);
        
      nodeInfosByName['p1'].trs.translation[0] += (deltaMouse * 20);

      playerPosition.x = nodeInfosByName['p1'].trs.translation[0];

      if(projectileAlive) {
        nodeInfosByName['projectile1'].trs.translation[1] += deltaTime * 30;

        if(nodeInfosByName['projectile1'].trs.translation[1] > 20) {
          deleteProjectile();
        }
        //console.log(nodeInfosByName['projectile1'].trs)
        
        //COLISÕES

        //COLISÕES PROJETIL DO PLAYER COM O RESTO
        for (const item in nodeInfosByName) {
          if(item != 'scene' && item != 'player' &&
          item != 'barrier' && item != 'enemy' &&
          item != 'projectile' && item != 'projectile1' &&
          item != 'enemyProjectiles' && item != 'enemyProjectiles2') {
            checkProjectileCollision(nodeInfosByName['projectile1'], nodeInfosByName[item]);
          }
        }
      }
      

      //COLISÕES PLAYER COM OS INIMIGOS OU PROJETEIS INIMIGOS PRA VER SE PERDEU
      for (const item in nodeInfosByName) {
        if(item != 'scene' && item != 'player' &&
          item != 'barrier' && item != 'enemy' &&
          item != 'projectile' && item != 'projectile1' &&
          item != 'p1' && item != 'enemyProjectiles' && 
          item != 'enemyProjectiles2') {
            checkPlayerCollision(nodeInfosByName['p1'], nodeInfosByName[item])
          }
      }

      for (const item in nodeInfosByName) {
        if(item != 'scene' && item != 'player' &&
          item != 'barrier' && item != 'enemy' &&
          item != 'projectile' && item != 'projectile1' &&
          item != 'p1' && item != 'enemyProjectiles' && 
          item != 'enemyProjectiles2' && item != 'b0'
          && item != 'b1' && item != 'b2' && item != 'b3') {
            checkBarrierCollision(nodeInfosByName['b0'], nodeInfosByName[item]);
            checkBarrierCollision(nodeInfosByName['b1'], nodeInfosByName[item]);
            checkBarrierCollision(nodeInfosByName['b2'], nodeInfosByName[item]);
            checkBarrierCollision(nodeInfosByName['b3'], nodeInfosByName[item]);
          }
      }


      if(enemyProjectile1Alive) {
        nodeInfosByName['pro0'].trs.type = 'pro';
        nodeInfosByName['pro0'].trs.index = 0;
        nodeInfosByName['pro0'].trs.translation[1] -= deltaTime * 40;

        if(nodeInfosByName['pro0'].trs.translation[1] < -20) {
          enemyProjectile1Alive = false;
        }
      }

      if(enemyProjectile2Alive) {
        nodeInfosByName['pro1'].trs.translation[1] -= deltaTime * 40;


        nodeInfosByName['pro1'].trs.type = 'pro';
        nodeInfosByName['pro1'].trs.index = 1;

        if(nodeInfosByName['pro1'].trs.translation[1] < -20) {
          enemyProjectile2Alive = false;
        }

      }
      
      if(animationTime > 0.5 && animationTime < 1) {
        if(!enemyProjectile1Alive) {
          createEnemyProjectile();
        }
      }
      else if(animationTime > 1) {
        if(!enemyProjectile2Alive) {
          createEnemyProjectile2();
        }
        animationTime = 0;
      }

      if(level == 2) {
        nodeInfosByName['scene'].trs.rotation[1] = now;
      }
      else if(level == 3) {
        if(levelAnimationTime > 2 && levelAnimationTime < 4) {
          cameras[0].cameraPosition = [15,15,30]
        }
        else if(levelAnimationTime > 4) {
          cameras[0].cameraPosition = [-15,15,30]
          levelAnimationTime = 0;
        }
      }
      else if(level == 4) {
        for(let i = 0; i < 21; i++) {
          nodeInfosByName[`e${i}`].trs.rotation[0] = 1.5;
        }
        cameras[0].cameraPosition = [nodeInfosByName['p1'].trs.translation[0] ,nodeInfosByName['p1'].trs.translation[1] - 5, nodeInfosByName['p1'].trs.translation[2] + 2]
        cameras[0].target = [nodeInfosByName['p1'].trs.translation[0], 0 , 0]
      }
      else if(level == 5) {
        cameras[0].cameraPosition = [0, 0, -30];
      }

      // Update all world matrices in the scene graph
      scene.updateWorldMatrix();

      // var colorNormalized = [];
      // for(let i=0; i<uiObj.color.length - 1; i++) {
      //   colorNormalized.push(uiObj.color[i]/255);
      // }
      // colorNormalized.push(1);

      // var lightColorNormalized = [];
      // for(let i=0; i<luz.lightColor.length - 1; i++) {
      //   lightColorNormalized.push(luz.lightColor[i]/255);
      // }

      // var specularColorNormalized = [];
      // for(let i=0; i<luz.specularColor.length - 1; i++) {
      //   specularColorNormalized.push(luz.specularColor[i]/255);
      // }

      if(animationRegulator > 190 && speed > 0) {
        speed += 1;
        speed *= -1;
      }
      else if(animationRegulator < -24 && speed < 0){
        speed -= 1;
        speed *= -1;
        moveEnemys(deltaTime, speed, 2);
      }

      moveEnemys(deltaTime, speed, 1);

      // Compute all the matrices for rendering
      objects.forEach(function (object) {
        
        object.drawInfo.uniforms.u_lightColor = [1,1,1];
        object.drawInfo.uniforms.u_specularColor = [1,1,1]; 

        object.drawInfo.uniforms.u_matrix = m4.multiply(
          viewProjectionMatrix,
          object.worldMatrix
        );
        
        if(level == 4) {
          object.drawInfo.uniforms.u_lightWorldPosition = [nodeInfosByName['p1'].trs.translation[0], nodeInfosByName['p1'].trs.translation[1] - 5, nodeInfosByName['p1'].trs.translation[2]+2];
        }
        else if(level == 5) {
          object.drawInfo.uniforms.u_lightWorldPosition = [0,0,-5];
        }
        else {
          object.drawInfo.uniforms.u_lightWorldPosition = [5, 0, 5];
        }
        
        if(projectileAlive) {
          object.drawInfo.uniforms.u_lightColor2 = [0,0,1];
          object.drawInfo.uniforms.u_specularColor2 = [0,0,1]; 
          object.drawInfo.uniforms.u_lightWorldPosition2 = [nodeInfosByName['projectile1'].trs.translation[0],nodeInfosByName['projectile1'].trs.translation[1],nodeInfosByName['projectile1'].trs.translation[2] + 5];
        }
        else {
          object.drawInfo.uniforms.u_lightColor2 = [0,0,0];
          object.drawInfo.uniforms.u_specularColor2 = [0,0,0]; 
          object.drawInfo.uniforms.u_lightWorldPosition2 = [0,0,0]
        }

        if(enemyProjectile1Alive) {
          object.drawInfo.uniforms.u_lightColor3 = [1,0,0];
          object.drawInfo.uniforms.u_specularColor3 = [1,0,0]; 
          object.drawInfo.uniforms.u_lightWorldPosition3 = [nodeInfosByName['pro0'].trs.translation[0],nodeInfosByName['pro0'].trs.translation[1],nodeInfosByName['pro0'].trs.translation[2] + 5];
        }
        else {
          object.drawInfo.uniforms.u_lightColor3 = [0,0,0];
          object.drawInfo.uniforms.u_specularColor3 = [0,0,0]; 
          object.drawInfo.uniforms.u_lightWorldPosition3 = [0,0,0]
        }

        if(enemyProjectile2Alive) {
          object.drawInfo.uniforms.u_lightColor4 = [1,0,0];
          object.drawInfo.uniforms.u_specularColor4 = [1,0,0]; 
          object.drawInfo.uniforms.u_lightWorldPosition4 = [nodeInfosByName['pro1'].trs.translation[0],nodeInfosByName['pro1'].trs.translation[1],nodeInfosByName['pro1'].trs.translation[2] + 5];
        }
        else {
          object.drawInfo.uniforms.u_lightColor4 = [0,0,0];
          object.drawInfo.uniforms.u_specularColor4 = [0,0,0]; 
          object.drawInfo.uniforms.u_lightWorldPosition4 = [0,0,0]
        }



        object.drawInfo.uniforms.u_world = m4.multiply(object.worldMatrix, m4.yRotation(fRotationRadians));

        object.drawInfo.uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(object.worldMatrix));
        
        object.drawInfo.uniforms.u_viewWorldPosition = cameras[0].cameraPosition;

        object.drawInfo.uniforms.u_shininess = 300;

        object.drawInfo.uniforms.u_color= [1,1,1,1];
      });

      // ------ Draw the objects --------
      twgl.drawObjectList(gl, objectsToDraw);

      document.getElementById('gameScore').textContent = score;
      document.getElementById('playerLife').textContent = playerLive;
      document.getElementById('level').textContent = level;
      //updateScene();

      requestAnimationFrame(drawScene);

      if(playerLive == 0 && !gameOver) {
        deathSound.play();
        bgm.pause();
        gameOver = true;
        //window.location.reload();
      }

      if(numberOfEnemys == 0 && !gameOver) {
        alert(`Ganhou! \nScore: ${score}`);
        gameOver = true;
        window.location.reload();
      }
  }
}
}

main();