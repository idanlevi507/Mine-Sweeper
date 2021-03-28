// 'use strict';

// function clickStart() {
//     document.querySelector('.timer').innerText
//     if (!timeIsOn) {
//         timeLooper = setInterval(startWatch, 10);
//         timeIsOn = true;
//     }
// }

// function startWatch() {
//     milSec++;
//     if (milSec === 99) {
//         sec++;
//         milSec = 00
//     }
//     if (sec === 60) {
//         min++;
//         sec = 00
//     }

//     (min < 10) ? minDisplay = '0' + min.toString() : minDisplay = min;
//     (sec < 10) ? secDisplay = '0' + sec.toString() : secDisplay = sec;
//     (milSec < 10) ? milSecDisplay = '0' + milSec : milSecDisplay = milSec
//     document.querySelector(".timer").innerText = minDisplay + ':' + secDisplay + ':' + milSecDisplay;
// }

// function stopWatch() {
//     clearInterval(timeLooper);
//     timeIsOn = false;
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
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
