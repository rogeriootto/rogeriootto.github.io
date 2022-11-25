var mousePositionX;
var mousePositionXNormalized;

var canvas = document.getElementById('canvas');

//tentar dar update no canvas conforme a animação rola no requestanimationframe

// quando mexe pela tela com o mouse
canvas.addEventListener('mousemove', function (e) {
    document.getElementById('x-value-move').textContent = (e.x);
    mousePositionX = e.x;
    mousePositionXNormalized = parseFloat((((((e.x)/(canvas.width))*2) - 1)).toFixed(2))
})

//quando clica em algo
canvas.addEventListener('click', function(f) {
    if(!projectileAlive) {
        createProjectile();
    }
    else {
        deleteProjectile();
    }
    //addVertice();
})

//mostra na tela onde foi clicado e salva no objeto mousePositionOnClick
function setProjectileOnClick(f) {

}

function addVertice() {
    positions.push(mousePositionOnClick.normalizedX, (mousePositionOnClick.normalizedY));
}