'use strict';
var W, H, S = 20;
var snake = [], foods = [], redFoods = [];
// var redFoodArray = [{ x: 5, y: 5 }, { x: 14, y: 6 }, { x: 6, y: 14 }];
var keyCode = 0;
var scores = 0;
var walls = [
    //wall-01
    { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
    //wall-02
    { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 14, y: 7 }, { x: 15, y: 7 }, { x: 16, y: 7 },
    //wall-03
    { x: 4, y: 15 }, { x: 5, y: 15 }, { x: 6, y: 15 }, { x: 7, y: 15 }, { x: 7, y: 14 }, { x: 7, y: 13 }, { x: 7, y: 12 }
];
var timer = NaN;
var ctx;



function addRedFood() {
    Array.forEach(function (p) {
        redFood.push(new Point(p.x, p.y));
    });
}

//Point Object  
function Point(x, y) {
    this.x = x;
    this.y = y;
}
//Collision Judgment
function isHit(data, x, y) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].x === x && data[i].y === y) {
            return true;
        }
    }
    return false;
}
// Determine Position && addFood()
function addFood() {
    while (true) {
        var x = Math.floor(Math.random() * W);
        var y = Math.floor(Math.random() * H);

        if (isHit(foods, x, y) || isHit(redFoods, x, y) || isHit(snake, x, y) || isHit(walls, x, y)) {
            continue;
        } else {
            foods.push(new Point(x, y));
            break;
        }
    }
}
function addRedFood() {
    while (true) {
        var x = Math.floor(Math.random() * W);
        var y = Math.floor(Math.random() * H);
        if (isHit(foods, x, y) || isHit(redFoods, x, y) || isHit(snake, x, y) || isHit(walls, x, y)) {
            continue;
        } else {
            redFoods.push(new Point(x, y));
            break;
        }
    }
}

//HitFood remove + addFood
function moveFood(x, y) {
    foods = foods.filter(function (p) {
        return (p.x != x || p.y != y);
    });
    addFood();
}
function moveRedFood(x, y) {
    redFoods = redFoods.filter(function (p) {
        return (p.x != x || p.y != y);
    });
    addRedFood();
}

//Initialization processing => initialize
function init() {
    var canvas = document.getElementById('field');
    W = canvas.width / S;
    H = canvas.height / S;
    ctx = canvas.getContext('2d');
    ctx.font = '20px sans-serif';

    //Snake Initialize
    snake.push(new Point(W / 2, H / 2));

    //Foods Initialize
    for (var i = 0; i < 10; i++) {
        addFood();
    }
    for (var i = 0; i < 2; i++) {
        addRedFood();
    }

    timer = setInterval('tick()', 200);
    window.onkeydown = keydown;
}

// onkeydown
function keydown(event) {
    keyCode = event.keyCode;
}


//Main Loop
function tick() {
    var x = snake[0].x;
    var y = snake[0].y;

    switch (keyCode) {
        case 37: x--; break; //left
        case 38: y--; break; //up
        case 39: x++; break; //right
        case 40: y++; break; //down
        default: paint(); return;
    }

    //Hit snakeSelf or Walls or canvasArea
    if (isHit(snake, x, y) || isHit(walls, x, y) || x < 0 || x >= W || y < 0 || y >= H) {
        clearInterval(timer);
        paint();
        return;
    }

    //add to Array snake [unshift,shift,pop,push]
    snake.unshift(new Point(x, y))
    if (isHit(foods, x, y)) {
        scores += 10;
        moveFood(x, y);
    } else if (isHit(redFoods, x, y)) {
        scores += 15;
        moveRedFood(x, y);
    } else if (isHit(snake, x, y)) {
        snake.pop();
    }
    paint();
}

//paint()
function paint() {
    ctx.clearRect(0, 0, W * S, H * S);
    wallCharPaint();
    ctx.fillStyle = '#ff0000'; //red
    ctx.fillText(scores, S, S * 2);

    redFoods.forEach(function (p) {
        ctx.fillText('+', p.x * S, p.y * S);
    });
    foods.forEach(function (p) {
        ctx.fillStyle = '#ff8c00' //orange
        ctx.fillText('+', p.x * S, p.y * S);
    });
    snake.forEach(function (p) {
        ctx.fillStyle = '#008000'; //green
        ctx.fillText('*', p.x * S, (p.y + 1) * S);
    });
}
// wall && char Paint
function wallCharPaint() {

    //N Preparatory school
    ctx.fillStyle = '#00CC66'
    ctx.beginPath();
    ctx.moveTo(250, 260);
    ctx.lineTo(300, 305);
    ctx.lineTo(300, 360);
    ctx.lineTo(250, 315);
    ctx.fill();

    ctx.fillStyle = '#191970';
    ctx.fillRect(210, 250, 40, 120);
    ctx.fillRect(300, 250, 40, 120);

    //walls
    ctx.strokeStyle = '#4169e1' //blue
    ctx.lineWidth = '25';
    ctx.beginPath();
    ctx.moveTo(160, 85);
    ctx.lineTo(85, 85);
    ctx.lineTo(85, 165);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(265, 74);
    ctx.lineTo(265, 150);
    ctx.lineTo(340, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(70, 305);
    ctx.lineTo(145, 305);
    ctx.lineTo(145, 235);
    ctx.stroke();
}
