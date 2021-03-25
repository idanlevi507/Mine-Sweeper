// 'use strict';

function startWatch() {
    milSec++;
    if (milSec === 99) {
        sec++;
        milSec = 00
    }
    if (sec === 60) {
        min++;
        sec = 00
    }

    if (min < 10) {
        minDisplay = '0' + min.toString()
    } else {
        minDisplay = min
    }
    if (sec < 10) {
        secDisplay = '0' + sec.toString()
    } else {
        secDisplay = sec
    }
    milSecDisplay = milSec
    document.querySelector(".timer").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;

}

function clickStart() {
    document.querySelector('.timer').innerText
    if (!timeIsOn) {
        looper = setInterval(startWatch, 10);
        timeIsOn = true;
    }
}

function stopWatch() {
    clearInterval(looper);
    timeIsOn = false;
}


function renderBoard1(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var className = `cell cell_${i}_${j}`;
            if (cell.isMarked) strHTML += `<td class=" ${className}" onclick="cellClicked(this,${i},${j})"  onmousedown="onButtonClick(${i},${j}, this)"> ${FLAG} </td>`;
            if (!cell.isShown) {
                strHTML += `<td class=" ${className}" onclick="cellClicked(this,${i},${j})"  onmousedown="onButtonClick(${i},${j}, this)"> ${WALL} </td>`;
            } else if (cell.type === MINE) strHTML += `<td class=" ${className}" onclick="cellClicked(${board},${i},${j})"> ${MINE} </td>`;
            else strHTML += `<td class=" ${className}" onclick="cellClicked(this,${i},${j})"> ${cell.minesAroundCount} </td>`;
        }

        strHTML += '</tr>'
    }
    strHTML += '</table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}





// function createMines(minesNum) {
//     var mine = {
//         ILocation: getRandomInt(0, gBoard.length - 1),
//         JLocation: getRandomInt(0, gBoard.length - 1),
//         type: MINE,
//         isShown: true,
//     }
//     gMines.push(mine)
// }



// function printMat(mat, selector) {
//     var strHTML = '<table border="0"><tbody>';
//     for (var i = 0; i < mat.length; i++) {
//       strHTML += '<tr>';
//       for (var j = 0; j < mat[0].length; j++) {
//         var cell = mat[i][j];
//         var className = 'cell cell' + i + '-' + j;
//         strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
//       }
//       strHTML += '</tr>'
//     }
//     strHTML += '</tbody></table>';
//     var elContainer = document.querySelector(selector);
//     elContainer.innerHTML = strHTML;
//   }




// // random num 
// function randomNum() {
//     var idx = getRandomInt(0, gNums.length)
//     var num = gNums[idx]
//     gNums.splice(idx, 1)
//     return num
// }

//random int
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
// }
// //timer
// firstTime = new Date().getTime();


// function getRandomColor() {
//     var letters = '0123456789ABCDEF';
//     var color = '#';
//     for (var i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
