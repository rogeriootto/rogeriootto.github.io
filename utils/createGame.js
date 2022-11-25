var playerIndex = 1;

var barrierIndex = 0;
var barrierPos = -15;

var enemyIndex = 0;
var enemyPos = {
    x: -20,
    y: 15,
}

var score = 0;

var bottomEnemy = [14,15,16,17,18,19,20]

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
    resizeBar();
    setObjIndex();
    animationRegulator = nodeInfosByName['e0'].trs.translation[0];
    
}

function checkProjectileCollision (objeto1, objeto2) {
    
    if(projectileAlive) {
        if(!(objeto2.trs.translation === undefined)) {
            //eixo X
            if((objeto1.trs.translation[0] + 1) >= (objeto2.trs.translation[0] - 1) && (objeto1.trs.translation[0] - 1) <= (objeto2.trs.translation[0] + 1)) {
                //eixo Y
                if((objeto1.trs.translation[1] + 1) >= (objeto2.trs.translation[1] -1) && (objeto1.trs.translation[1] - 1) <= (objeto2.trs.translation[1] + 1)) {
                    //COLIDIU
                    deleteProjectile();
                    deleteObject(objeto2);
                    givePoints(objeto2.trs.type);
                }
            }
        }
    }

    //Não Colidiu
}

function checkPlayerCollision(player, objeto) {
    if(!(objeto.trs.translation === undefined)) {
        //eixo X
        if((player.trs.translation[0] + 1) >= (objeto.trs.translation[0] - 1) && (player.trs.translation[0] - 1) <= (objeto.trs.translation[0] + 1)) {
            //eixo Y
            if((player.trs.translation[1] + 1) >= (objeto.trs.translation[1] -1) && (player.trs.translation[1] - 1) <= (objeto.trs.translation[1] + 1)) {
                //COLIDIU
                //speed = 0;
            }
        }
    }
}

function resizeBar() {
    //resizeBarrier

    for(let i=0; i < 4; i++) {
        if(!(nodeInfosByName[`b${i}`] === undefined)) {
            nodeInfosByName[`b${i}`].trs.scale[0] = 2;
        }
        else {

        }
    }
}

function setObjIndex() {
    for(let i = 0; i < 4; i++) {
        if(!(nodeInfosByName[`b${i}`] === undefined)) {
            nodeInfosByName[`b${i}`].trs.index = i;
            nodeInfosByName[`b${i}`].trs.type = 'b';
        }
    }

    for(let i = 0; i < 21; i++) {
        nodeInfosByName[`e${i}`].trs.index = i;
        nodeInfosByName[`e${i}`].trs.type = 'e';
    }
}

function createPlayer() {

  var newObj = {
    name: `p${playerIndex}`,
    index: playerIndex,
    type: 'p',
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
        type: 'b',
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
    
    barrierPos += 10;
    nodeInfosByName[newObj.name].trs.index = barrierIndex;
    barrierIndex++;
}

function createEnemy(i) {
    updateScene()
    var newObj = {
        name: `e${enemyIndex}`,
        index: enemyIndex,
        type: 'e',
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
   
    enemyPos.x += 5;
    if((i % 7) == 0 && i != 0) {
        enemyPos.y -= 4;
        enemyPos.x = -20;
    }

    enemyIndex++;
}

function createProjectile() {

    updateScene()
  

    var newObj = {
        name: 'projectile1',
        index: 0,
        translation: [playerPosition.x, -11, 0],
        type: 'pro',
        children: [],
        vao: cubeVAO,
        bufferInfo: cubeBufferInfo,
    }
    
    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    objeto.children[3].children.push(newObj);

    scene = makeNode(objeto);
    
    resizeBar();
    setObjIndex()
    projectileAlive = true;
}

function deleteProjectile() {

    updateScene()

    projectileAlive = false;
    objeto.children[3].children.pop();

    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    scene = makeNode(objeto);  //AQUI ESTÁ O PROBLEMA

    resizeBar();
    setObjIndex()
}

function deleteObject(objetcToDelete) {

    bottomEnemy.forEach(function(item, index) {
        if(objetcToDelete.trs.index == item) {
            bottomEnemy[index] -= 7;
        }
    })

    nodeInfosByName[`${objetcToDelete.trs.type}${objetcToDelete.trs.index}`].trs.translation = [500,500,500]
}

function updateScene() {
    const updatedValues = objeto.children.map(item => {
        let name = item.name;
        const updatedValues2 = item.children.map((item2, index) => {
            let name2 = item2.name;
            item2.translation = nodeInfosByName[name2].trs.translation;
            item2.rotation = nodeInfosByName[name2].trs.rotation;
            item2.index = nodeInfosByName[name2].trs.index;
            item2.type = nodeInfosByName[name2].trs.type;
            item2.format = nodeInfosByName[name2].format;

            return item2;
        })

        item.translation = nodeInfosByName[name].trs.translation;
        item.rotation = nodeInfosByName[name].trs.rotation;
        item.index = nodeInfosByName[name].trs.index;
        item.type = nodeInfosByName[name].trs.type;
        item.format = nodeInfosByName[name].format;

        return item;
    })

    objeto.children = [...updatedValues];
}

function givePoints(objectType, objectIndex) {
    console.log(objectType)
    score += 100;
}

function moveEnemys(deltaTime, speed, animationType) {
    
    if(animationType == 1) {
        for(let i = 0; i<21; i++) {
            nodeInfosByName[`e${i}`].trs.translation[0] += (deltaTime) * speed;
            animationRegulator += (deltaTime) * speed;
        }
    }
    else if(animationType == 2) {
        for(let i = 0; i<21; i++) {
            nodeInfosByName[`e${i}`].trs.translation[1] -= 2;
        }
    }

}

function createEnemyProjectile() {

    updateScene()
    
    var randomEnemy = Math.floor(Math.random() * 6);

    var newObj = {
        name: 'pro0',
        index: 0,
        translation: [nodeInfosByName[`e${bottomEnemy[randomEnemy]}`].trs.translation[0], nodeInfosByName[`e${bottomEnemy[randomEnemy]}`].trs.translation[1] - 1, 0],
        type: 'pro',
        children: [],
        vao: cubeVAO,
        bufferInfo: cubeBufferInfo,
    }
    
    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    objeto.children[4].children.push(newObj);

    scene = makeNode(objeto);
    
    resizeBar();
    setObjIndex()
    enemyProjectile1Alive = true;

}

function createEnemyProjectile2() {

    updateScene()
    
    var randomEnemy = Math.floor(Math.random() * 6);

    var newObj = {
        name: 'pro1',
        index: 0,
        translation: [nodeInfosByName[`e${bottomEnemy[randomEnemy]}`].trs.translation[0], nodeInfosByName[`e${bottomEnemy[randomEnemy]}`].trs.translation[1] - 1, 0],
        type: 'pro',
        children: [],
        vao: cubeVAO,
        bufferInfo: cubeBufferInfo,
    }
    
    objectsToDraw = [];
    objects = [];
    nodeInfosByName = {};

    objeto.children[5].children.push(newObj);

    scene = makeNode(objeto);
    
    resizeBar();
    setObjIndex()
    enemyProjectile2Alive = true;

}