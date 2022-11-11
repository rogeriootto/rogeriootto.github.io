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
    setPositionsOnClick(f);
    //addVertice();
})

//mostra na tela onde foi clicado e salva no objeto mousePositionOnClick
function setPositionsOnClick(f) {
    document.getElementById('x-value-click').textContent = (f.x);
    mousePositionOnClick.x = (f.x);
    document.getElementById('y-value-click').textContent = (f.y);
    mousePositionOnClick.y = (f.y);

    var normalizedx = parseFloat((((((f.x)/(canvas.width + 1))*2) - 1)).toFixed(2))
    var normalizedy = parseFloat((((((f.y)/(canvas.height + 1))*2) - 1)).toFixed(2))
    normalizedy *= -1;

    document.getElementById('x-value-click-normalized').textContent = normalizedx;
    mousePositionOnClick.normalizedX = normalizedx;
    document.getElementById('y-value-click-normalized').textContent = normalizedy;
    mousePositionOnClick.normalizedY = normalizedy;
}

function addVertice() {
    positions.push(mousePositionOnClick.normalizedX, (mousePositionOnClick.normalizedY));
}