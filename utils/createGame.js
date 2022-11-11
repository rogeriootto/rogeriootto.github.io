var playerIndex = 1;

var barrierIndex = 0;
var barrierPos = -15;

var enemyIndex = 0;
var enemyPos = {
    x: -15,
    y: 15,
}

function createGame() {

    //Player
    createPlayer();

    //Barriers
    for(let i = 0; i < 4; i++) {
        createBarriers();
    }

    //Enemy
    for(let i = 1; i <= 21; i++) {
        createEnemy(i);
    }

    //resizeBarrier
    nodeInfosByName['b0'].trs.scale[0] = 2;
    nodeInfosByName['b1'].trs.scale[0] = 2;
    nodeInfosByName['b2'].trs.scale[0] = 2;
    nodeInfosByName['b3'].trs.scale[0] = 2;

}


function createPlayer() {

  var newObj = {
    name: `p${playerIndex}`,
    index: playerIndex,
    translation: [0, -13, 0],
    children: [],
    vao: cubeVAO,
    bufferInfo: cubeBufferInfo,
  }

  //uiObj.objArray.push(newObj.name);
  
  objeto.children[0].children.push(newObj);

  objectsToDraw = [];
  objects = [];
  nodeInfosByName = {};

  scene = makeNode(objeto);
  playerIndex++;
}

function createBarriers() {
    var newObj = {
        name: `b${barrierIndex}`,
        index: barrierIndex,
        translation: [barrierPos, -9, 0],
        children: [],
        vao: cubeVAO,
        bufferInfo: cubeBufferInfo,
    }

    objeto.children[1].children.push(newObj);
    
    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    
    scene = makeNode(objeto);
    barrierIndex++;
    barrierPos += 10;
}

function createEnemy(i) {
    var newObj = {
        name: `e${enemyIndex}`,
        index: enemyIndex,
        translation: [enemyPos.x, enemyPos.y, 0],
        children: [],
        vao: cubeVAO,
        bufferInfo: cubeBufferInfo,
    }

    objeto.children[2].children.push(newObj);
    
    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};
    
    scene = makeNode(objeto);
    enemyIndex++;
    enemyPos.x += 5;
    if((i % 7) == 0 && i != 0) {
        console.log('teste')
        enemyPos.y -= 5;
        enemyPos.x = -15;
    }
}