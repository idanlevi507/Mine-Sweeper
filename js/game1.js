'use strict'
console.log('Mine Sweeper');

const noRightClick = document.querySelector(".board-container");
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

const EMPTY = 'empty';
const MINE = '💣';
const WALL = '';
const FLAG = '⛳'

var minesAroundCount;
var gBoard = [];
var gMines = [];
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
    level: 'beginner',
}

//timer
var milSec = 0;
var sec = 0;
var min = 0;
var minDisplay;
var secDisplay;
var milSecDisplay;
var timeIsOn;
var timeLooper;

var gBest = {
    beginner: {
        name: '',
        time: ''
    },
    medium: {
        name: '',
        time: '',
    },
    hard: {
        name: '',
        time: ''
    },
};

if (localStorage.getItem('Best')) {
    gBest = JSON.parse(localStorage.getItem('Best'))
    document.getElementById('best-time').innerText = `Best : ${gBest[gLevel.level].name} - ${gBest[gLevel.level].time}`;
}

function initGame() {
    gBoard = buildBoard(gLevel.SIZE);
}

function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    board = createMines(board, gLevel.MINES)
    board = setMinesNegsCount(board)
    renderBoard(board)
    return board
}

function createMines(board, totalMinesNum) {
    for (var idx = 0; idx < totalMinesNum; idx++) {
        var i = getRandomInt(0, board.length);
        var j = getRandomInt(0, board.length);
        if (board[i][j].isMine) {
            idx--;
            continue
        }
        board[i][j] = {
            isShown: false,
            isMine: true,
            isMarked: false,
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = countMinesAround(board, i, j)
        }
    }
    return board;
}

function countMinesAround(board, cellI, cellJ) {
    var minesAround = 0;
    var i = cellI
    var j = cellJ
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue
            if (board[i][j].isMine) minesAround++;
        }
    }
    return minesAround;
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var className = `cell cell${gLevel.SIZE} cell_${i}_${j}`;
            strHTML += `<td class=" ${className}" onclick="cellClicked(this,${i},${j})"  onmousedown="onButtonClick(${i},${j}, this)"> ${WALL} </td>`;
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) return;
    if (!gGame.shownCount && gBoard[i][j].isMine) {
        gBoard = buildBoard(gLevel.SIZE);
        cellClicked(elCell, i, j)
        return;
    };

    if (!timeIsOn) setTimerOn();
    (gBoard[i][j].isMine) ? elCell.innerText = MINE : document.querySelector(`.cell_${i}_${j}`).innerText = gBoard[i][j].minesAroundCount;
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    checkGameOver(i, j);
    if (gBoard[i][j].minesAroundCount === 0) revealEmptyCells(gBoard, i, j);
}

function onButtonClick(i, j, elCell) {
    if (!gGame.isOn) return;
    if (event.button != 2) return
    if (!timeIsOn) setTimerOn();
    if (gBoard[i][j].isShown) return
    // if (gLevel.MINES === gGame.markedCount && gBoard[i][j].isMarked === false) return;      disable using more flags than mines numbers.
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

function checkGameOver(i, j) {
    if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        gGame.isOn = false;
        stopTimer()
        revealAllMines();
        document.querySelector('.restart').innerText = '☹';
        document.querySelector(`.cell_${i}_${j}`).style.backgroundColor = 'red'
        return;
    }
    gGame.shownCount = countShownCells()  // because bug somewhere
    var emptyCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES 
    if (gGame.shownCount === emptyCells && gLevel.MINES === gGame.markedCount) {
        document.querySelector('.restart').innerText = '🤩'
        stopTimer()
        gGame.isOn = false;
        checkAndSetBestTime()
        return true
    }
}

function revealEmptyCells(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            if (cellI === i && cellJ === j) continue;
            if (gBoard[i][j].isShown) continue;
            if (gBoard[i][j].isMarked)continue;
            document.querySelector(`.cell_${i}_${j}`).innerText = gBoard[i][j].minesAroundCount
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            checkGameOver(cellI, cellJ);
            if (gBoard[i][j].minesAroundCount === 0) {
                revealEmptyCells(board, i, j);
            }
        }
    }
    
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) {
                document.querySelector(`.cell_${i}_${j}`).innerText = MINE
            }
        }
    }
}

function checkAndSetBestTime() {
    var isBest = false;
    var newTime = document.querySelector(".timer").innerText;
    if (!gBest[gLevel.level].time) isBest = true;
    else {
        var newTimeNumber = Number(newTime.replaceAll(':', ''));
        var currentBest = Number(gBest[gLevel.level].time.replaceAll(':', ''))
        if (newTimeNumber < currentBest) { 
            isBest = true;
        }
    }
    if (isBest) {
        alert('You set a new record!!')
        gBest[gLevel.level].time = newTime;
        gBest[gLevel.level].name = prompt('Enter name');
        localStorage.setItem('Best', JSON.stringify(gBest));
    }
}

function chooseLevel(size, minesAmount, level) {
    gLevel.SIZE = size;
    gLevel.MINES = minesAmount;
    gLevel.level = level
    restartGame();
}

function restartGame() {
    restartClock()
    gBoard = [];
    gMines = [];
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
    }
    document.querySelector('.restart').innerText = '😀'
    if (gBest[gLevel.level].time) document.getElementById('best-time').innerText = `Best : ${gBest[gLevel.level].name} - ${gBest[gLevel.level].time}`;
    else document.getElementById('best-time').innerText = `Best: 00:00:00`;
    initGame()
}

function countShownCells() {
    //built beacuse sometimes gGame.shownCount =  :(
    var countShown = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown) countShown++
        }
    }
    if (countShown !== gGame.shownCount) {
        console.log(countShown, gGame.shownCount);
        alert("oops");
    }
    return countShown;
}

function restartClock() {
    stopTimer()
    milSec = 0;
    sec = 0;
    min = 0;
    minDisplay = '00';
    secDisplay = '00';
    milSecDisplay = '00';
    document.querySelector(".timer").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;

}

function setTimerOn() {
    document.querySelector('.timer').innerText
    timeLooper = setInterval(runTimer, 10);
    timeIsOn = true
}

function runTimer() {
    milSec++;
    if (milSec === 99) {
        sec++;
        milSec = 0
    }
    if (sec === 60) {
        min++;
        sec = 0
    }

    (min < 10) ? minDisplay = '0' + min.toString() : minDisplay = min;
    (sec < 10) ? secDisplay = '0' + sec.toString() : secDisplay = sec;
    (milSec < 10) ? milSecDisplay = '0' + milSec : milSecDisplay = milSec
    document.querySelector(".timer").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;
}

function stopTimer() {
    clearInterval(timeLooper);
    timeIsOn = false;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
