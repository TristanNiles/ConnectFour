let canvas;
let context;
let vertBoard;
let diagBoard1;
let diagBoard2;
let ix;
let vertIx;
let diagIx1;
let diagIx2;
let col;
let won = false;

let model = {
  board: "......./......./......./......./......./.......",
  next: "r"
}

vertBoard = '\0';
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 6; j++) {
    vertBoard = vertBoard + model.board.charAt(6-i+j*8);
  }
  if (i != 6) {
    vertBoard = vertBoard + '/'
  }
}

diagBoard1 = '\0';
for (let i = 0; i < 6-1; i++) {
  //cases that get bigger as you go down
  for (let j = 0; j <= i; j++) {
    diagBoard1 = diagBoard1 + model.board.charAt( (i-j)*8 + j );
  }
  diagBoard1 = diagBoard1 + '/';
}
for (let i = 0; i <= 7-6; i++) {
  //longest cases of same size
  for (let j = 0; j < 6; j++) {
    diagBoard1 = diagBoard1 + model.board.charAt( (5-j)*8 + j + i );
  }
  diagBoard1 = diagBoard1 + '/';
}
for (let i = 0; i < 6-1; i++) {
  //cases that get smaller as you go down
  for (let j = 0; j < 5-i; j++) {
    diagBoard1 = diagBoard1 + model.board.charAt( (5-j)*8 + 2 + i + j );
  }
  if (i != 4) {
    diagBoard1 = diagBoard1 + '/';
  }
}
diagBoard2 = '\0';
for (let i = 0; i < 6-1; i++) {
  for (let j = 0; j <= i; j++) {
    diagBoard2 = diagBoard2 + model.board.charAt( 6 + 8*j - (i - j) );
  }
  diagBoard2 = diagBoard2 + '/';
}
for (let i = 0; i <= 7-6; i++) {
  for (let j = 0; j < 6; j++) {
    diagBoard2 = diagBoard2 + model.board.charAt( 6 + 8*j - (5 - j) - i);
  }
  diagBoard2 = diagBoard2 + '/';
}
for (let i = 0; i < 6-1; i++) {
  for (let j = 0; j < 5-i; j++) {
    diagBoard2 = diagBoard2 + model.board.charAt( 8*(i+1) + 9*j);
  }
  if (i != 4) {
    diagBoard2 = diagBoard2 + '/';
  }
}

function sumN (n) {
  return  ( n * (n+1) )/2;
}

function ixToDiag1 (row, col) {
  let row0; //0th index of the row
  if (col + row == 0) {
    return 0;
  } else if (col == 0) {
    return sumN(row+1) - 1;
  } else if (col + row < 6) {
    row0 = sumN(row+1) - 1;
    return sumN(col+2+row) - sumN(2+row) + row0;
  } else {
    return 55 - sumN(6-col+2) - sumN(5-row+7-col) + sumN(6-col+1);
  }
}

function ixToDiag2 (row, col) {
  let col0; //0th index of the column
  if ( row + (6-col) == 0 ) {
    return 0;
  } else if (row == 0) {
    return sumN(6-col+1) - 1;
  } else if ( (5-row) + col > 4) {
    col0 = sumN(6-col+1) - 1;
    return sumN(row+2+(6-col))  - sumN(6-col+2) + col0;
  } else {
    return 52 - sumN(col+1) + 1 - sumN(2+(5-row)+col) + sumN(col+2);
  }
}

document.addEventListener("DOMContentLoaded", () => { 
  canvas = document.querySelector("#myCanvas");
  context = canvas.getContext("2d");
  splat();
})

function tick() {
  if (!won) {
    window.requestAnimationFrame(splat);
  }
}

function splat(n) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#1ac0c6";
  context.fillRect(0, 0, 700, canvas.height);
  context.global
  
  for(let i = 0; i < 7; i++) {
    for(let j = 0; j < 6; j++) {
      context.beginPath();
      context.arc(i*100+50, j*100+50, 40, 0, 2*Math.PI);
      context.fillStyle = "white";
      context.fill();
      
      let me = model.board.charAt(i+j*8);
      if (me == 'y') {
        context.beginPath();
        context.arc(i*100+50, j*100+50, 40, 0, 2*Math.PI);
        context.fillStyle = "#fdfa66";
        context.fill();
      }
      if (me == 'r') {
        context.beginPath();
        context.arc(i*100+50, j*100+50, 40, 0, 2*Math.PI);
        context.fillStyle = "#e74645";
        context.fill();
      }
    }
  }  
  
  context.fillStyle = "#fb7756";
  context.font = "50pt 'Roboto', sans-serif";
  
  if ( model.board.includes("rrrr") || vertBoard.includes("rrrr") || diagBoard1.includes("rrrr") || diagBoard2.includes("rrrr")) {
    won = true;
    context.fillText("Red wins!", 710, 60);
    context.fillText("Refresh to play again", 710, 120);
    return;
  }
  if ( model.board.includes("yyyy") || vertBoard.includes("yyyy") || diagBoard1.includes("yyyy") || diagBoard2.includes("yyyy")) {
    won = true;
    context.fillText("Yellow wins!", 710, 60);
    context.fillText("Refresh to play again", 710, 120);
    return;
  }
  if ( !model.board.includes('.')) {
    context.fillText("No winner!", 710, 60);
    context.fillText("Refresh to play again", 710, 120);
    return;
  }
  
  if (model.next == 'r' && !won) {
    context.fillText("Red's turn", 710, 60);
  } else if (model.next == 'y' && won == false) {
    context.fillText("Yellow's turn", 710, 60);
  }
  
  tick();
  
}

function clickSpace (x) {
  return Math.floor( (x-10)/100 )
}

document.addEventListener("click", e => {
  col = clickSpace(e.x);
  if (col < 0 || col > 6 || e.y > 610) {
    return;
  }
  
  for (let j = 5; j >= 0; j--) {
    ix = col+j*8;
    vertIx = (6-col)*7+j;
    diagIx1 = ixToDiag1(j, col);
    diagIx2 = ixToDiag2(j, col);
    if (model.board.charAt(ix) == '.') {
      model.board =
        model.board.slice(0, ix) +
        model.next +
        model.board.slice(ix+1, 100);
      
      vertBoard = 
        vertBoard.slice(0, vertIx+1) +
        model.next + 
        vertBoard.slice(vertIx+2, 100);
      
      diagBoard1 =
        diagBoard1.slice(0, diagIx1+1) +
        model.next +
        diagBoard1.slice(diagIx1+2, 100);

      diagBoard2 =
        diagBoard2.slice(0, diagIx2+1) +
        model.next +
        diagBoard2.slice(diagIx2+2, 100);
      //note: I use 100 because slice will stop adding when it reaches the end of the board regardless */
      
      if (model.next == 'y') {
        model.next = 'r'
      } else if (model.next == 'r') {
        model.next = 'y'
      }
      
      return;
    }
  }
  
})
