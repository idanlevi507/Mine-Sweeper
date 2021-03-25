'use strict'
console.log('Mine Sweeper');

const EMPTY = 'empty';
const MINE = '💣';
const WALL = '';
const FLAG = '⛳'

const noRightClick = document.querySelector(".board-container");
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

var minesAroundCount;
var gBoard = [];
var gMines = [];
var timer;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var milSec = 0;
var sec = 0;
var min = 0;
var minDisplay;
var secDisplay;
var milSecDisplay;
var timeIsOn;
var looper;


function initGame() {
    buildBoard(gLevel.SIZE);

}

function chooseLevel(size,minesAmount) {
    gLevel.SIZE = size;
    gLevel.MINES = minesAmount;
    restartGame();
}

function createMines(board, num) {
    for (var idx = 0; idx < num; idx++) {
        var i = getRandomInt(0, board.length);
        var j = getRandomInt(0, board.length);
        if (board[i][j].isMine) {
            idx--;
            continue
        }
        board[i][j] = {
            isMine: true,
            isMarked: false,
            type: MINE
        }
    }
}


function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                type: EMPTY,
                minesAroundCount,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
        // console.log(board);
    }
    createMines(board, gLevel.MINES)

    gBoard = board
    setMinesNegsCount(board)
    renderBoard(board)
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var className = `cell cell_${i}_${j}`;
            strHTML += `<td class=" ${className}" onclick="cellClicked(this,${i},${j})"  onmousedown="onButtonClick(${i},${j}, this)"> ${WALL} </td>`;
        }

        strHTML += '</tr>'
    }
    strHTML += '</table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function restartGame() {
    restartClock()
    gBoard = [];
    gMines = [];
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    initGame()
}
function restartClock() {
    stopWatch()
    milSec = 0;
    sec = 0;
    min = 0;
    minDisplay = '00';
    secDisplay = '00';
    milSecDisplay = '00';
    document.querySelector(".timer").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;

}


function onButtonClick(i, j, elCell) {
    if (!gGame.isOn) return;
    clickStart();
    if (event.button != 2) return
    if (gLevel.MINES === gGame.markedCount && gBoard[i][j].isMarked === false) return;
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = WALL;
        gGame.markedCount--;
    } else {
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++;
        checkGameOver(i, j);
    }
}

function revealEmptyCells(board, i, j) {
    var cellI = i;
    var cellJ = j;
    for (i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (cellI === i && cellJ === j) continue;
            if (board[i][j].isShown) continue;
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].isShown = true;
                gGame.shownCount++;
                document.querySelector(`.cell_${i}_${j}`).innerText = board[i][j].minesAroundCount
                revealEmptyCells(board, i, j);
                continue;
            }
            if (board[i][j].minesAroundCount > 0) {
                board[i][j].isShown = true;
                gGame.shownCount++;
                document.querySelector(`.cell_${i}_${j}`).innerText = board[i][j].minesAroundCount
                continue
            }
        }
    }
}


function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    clickStart();

    if (gBoard[i][j].isMarked) return;
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    (gBoard[i][j].type === MINE) ? elCell.innerText = MINE : elCell.innerText = gBoard[i][j].minesAroundCount;
    checkGameOver(i, j);
    if (gBoard[i][j].minesAroundCount === 0) revealEmptyCells(gBoard, i, j);
}

function checkGameOver(i, j) {
    if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) {
        stopWatch()
        gGame.isOn = false;
        revealAllMines();
        document.querySelector('.restart').innerText = '☹';
        return ;
    }
    var emptyCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if (gGame.shownCount === emptyCells && gLevel.MINES === gGame.markedCount) {
        document.querySelector('.restart').innerText = '🤩'
        stopWatch()
        gGame.isOn = false;
        return true
    }
}

function cellMarked(elCell) { }



function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) {
                document.querySelector(`.cell_${i}_${j}`).innerText = MINE
            }
        }
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = countMinesAround(board, i, j)
        }
    }
}


function countMinesAround(board, cellI, cellJ) {
    var minesAround = 0;
    var i = cellI
    var j = cellJ
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue
            var currCellType = board[i][j].type;
            if (currCellType === MINE) minesAround++;
        }
    }
    return minesAround;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
