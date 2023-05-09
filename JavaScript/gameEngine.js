class GameEngine {

  constructor () {
    this.gameLoop();
  }

  async gameLoop () {
    let pair=this.init();
    this.drawer(pair);
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let move = prompt(`To go to main page enter -2 to Reset Enter -1\n Enter move :`);
      
      if (move == '-2') {
        window.location.href = "index.html";
        continue;
      }
      pair = this.controller(pair,move);
      this.drawer(pair);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  init(){}
  drawer(pair){}
  controller(pair,move){}
}

class checkers extends GameEngine {

  constructor () {
    super ();
  }

  init () {
    const board = [
      [' ','1','2','3','4','5','6','7','8'],
      ['a',' ','b',' ','b',' ','b',' ','b'],
      ['b','b',' ','b',' ','b',' ','b',' '],
      ['c',' ','b',' ','b',' ','b',' ','b'],
      ['d',' ',' ',' ',' ',' ',' ',' ',' '],
      ['e',' ',' ',' ',' ',' ',' ',' ',' '],
      ['f','r',' ','r',' ','r',' ','r',' '],
      ['g',' ','r',' ','r',' ','r',' ','r'],
      ['h','r',' ','r',' ','r',' ','r',' ']
    ];

    let player = 'r';
    return [board, player];
  }

  notValid (n) {
    return (n < 1 || n > 8);
  }

  controller (game, move) {
    if(move==""||move==null){
      return game
  }
    const board = game[0];
    let currentPlayer = game[1];
    if (move == '-1') {
      return this.init();
    }
    if (move.length < 6) {
      console.log(`Not valid move`);
      return [board, currentPlayer];
    }
    const [start, end] = move.split(',').map(p => p.trim());
    if (start.length < 2 || end.length < 2) {
      console.log(`Wrong input`);
      return [board, currentPlayer];
    }
    let startRow = start[0].charCodeAt (0) - 'a'.charCodeAt (0) + 1;
    let startCol = Number(start[1]);
    let endRow = end[0].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    let endCol = Number(end[1]);
    if (this.notValid(startRow) || this.notValid(startCol) || this.notValid(endRow) || this.notValid(endCol)) {
      console.log(`Out of bounds`);
      return [board, currentPlayer];
    }
    if (board[startRow][startCol] !== currentPlayer) {
      console.log(`It's not ${currentPlayer}'s turn`);
      return [board, currentPlayer];
    }
    const piece = board[startRow][startCol];
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);
    if (absRowDiff !== absColDiff || absRowDiff > 2) {
      console.log('Invalid move');
      return [board, currentPlayer];
    }
    if (absRowDiff === 1 && absColDiff === 1) { // normal move
      if (board[endRow][endCol] === ' ') {
        board[endRow][endCol] = piece;
        board[startRow][startCol] = ' ';
        currentPlayer = (currentPlayer === 'r')? 'b':'r';
        return [board, currentPlayer];
      }
    }
    if (absRowDiff === 2 && absColDiff === 2) { // eat move
      const jumpRow = startRow + rowDiff / 2;
      const jumpCol = startCol + colDiff / 2;
      const otherPlayer = (currentPlayer === 'r')? 'b':'r';
      if (board[jumpRow][jumpCol] === otherPlayer) {
        if (board[endRow][endCol] === ' ') {
          board[jumpRow][jumpCol] = ' ';
          board[endRow][endCol] = piece;
          board[startRow][startCol] = ' ';
          currentPlayer = (currentPlayer === 'r')? 'b':'r';
          return [board, currentPlayer];
        }
      }
    }
    console.log('Invalid move');
    return [board, currentPlayer];
  }

  drawer (game) {
    const board = game[0];
    document.body.innerHTML = '';
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'checkersStyle.css';
    document.head.append (link);

    const label = document.createElement('div');
    label.innerHTML = `<h1>Checkers</h1>`;
    document.body.appendChild(label);
    const container = document.createElement('div');
    container.className = 'board-container';
  
    // Add the indexing row at the top of the board
    const indexRow = document.createElement('div');
    indexRow.className = 'index-row';
  
    for (let j = 0; j < board[0].length; j++) {
      const indexCell = document.createElement('div');
      indexCell.className = 'index-cell';
      indexCell.textContent = board[0][j];
      indexRow.appendChild(indexCell);
    }
  
    container.appendChild(indexRow);
  
    // Loop through each row of the board and create the HTML elements for each cell
    for (let i = 1; i < board.length; i++) {
      const row = document.createElement('div');
      row.className = 'board-row';
  
      // Add the indexing column to the left of the row
      const indexCell = document.createElement('div');
      indexCell.className = 'index-cell';
      indexCell.textContent = board[i][0];
      row.appendChild(indexCell);
  
      // Loop through each cell in the row and create the HTML element
      for (let j = 1; j < board[i].length; j++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
  
        if ((i + j) % 2 === 0) {
          cell.classList.add('light');
        } else {
          cell.classList.add('dark');
        }
  
        if (board[i][j] === 'r') {
          const redPiece = document.createElement('div');
          redPiece.className = 'red-piece';
          cell.appendChild(redPiece);
        } else if (board[i][j] === 'b') {
          const blackPiece = document.createElement('div');
          blackPiece.className = 'black-piece';
          cell.appendChild(blackPiece);
        }
  
        row.appendChild(cell);
      }
  
      container.appendChild(row);
    }
  
    document.body.appendChild(container);
    let text = document.createElement('div');
    text.className = `Text`;
    let p = game[1];
    if (p === 'r') {
      text.textContent = `It's red player turn`;
      text.style.color = `red`;
    } else {
      text.textContent = `It's black player turn`;
      text.style.color = `black`;
    }
    document.body.appendChild(text);
    let move = document.createElement(`div`);
    move.textContent = `The input form: <from>, <to> (ex. a1, b2)`;
    move.className = `Move`;
    document.body.appendChild(move);
    }

}


class EightQueens extends GameEngine {
  
  constructor () {
    super ();
  }

  init () {
    const board = [
      [' ','1','2','3','4','5','6','7','8'],
      ['a',' ',' ',' ',' ',' ',' ',' ',' '],
      [' b',' ',' ',' ',' ',' ',' ',' ',' '],
      ['c',' ',' ',' ',' ',' ',' ',' ',' '],
      ['d',' ',' ',' ',' ',' ',' ',' ',' '],
      ['e',' ',' ',' ',' ',' ',' ',' ',' '],
      ['f',' ',' ',' ',' ',' ',' ',' ',' '],
      ['g',' ',' ',' ',' ',' ',' ',' ',' '],
      ['h',' ',' ',' ',' ',' ',' ',' ',' ']
    ];

    return [board, 8];
  }

  isSafe(board, row, col) {
    // Check the row
    for (let i = 1; i < 9; i++) {
      if (board[row][i] === 'Q') {
        return false;
      }
    }
  
    // Check the column
    for (let i = 1; i < 9; i++) {
      if (board[i][col] === 'Q') {
        return false;
      }
    }
  
    // Check the diagonal
    for (let i = row, j = col; i > 0 && j > 0; i--, j--) {
      if (board[i][j] === 'Q') {
        return false;
      }
    }
    for (let i = row, j = col; i > 0 && j < 9; i--, j++) {
      if (board[i][j] === 'Q') {
        return false;
      }
    }
  
    return true;
  }

  notValid (n) {
    return (n < 1 || n > 8);
  }

  controller (game, move) {
    if(move==""||move==null){
      return game
  }
    const board = game[0];
    let queens = game[1];
    if (move == '-1') {
      return this.init;
    }
    if (move.length < 2) {
      return [board, queens];
    }
    let rowIndex = move[0].charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    let colIndex = Number(move[1]);
    if (this.notValid(rowIndex) || this.notValid(colIndex)) {
      return [board, queens];
    }
    if (queens === 0) {
      return [board, queens];
    }
    if (board[rowIndex][colIndex] === 'Q') {
      board[rowIndex][colIndex] = ' ';
      queens++;
      return [board, queens];
    }
    if (this.isSafe(board, rowIndex, colIndex)) {
      queens--;
      board[rowIndex][colIndex] = 'Q';
      return [board, queens];
    }
    return [board, queens];
  }

  drawer(game) {
    const board = game[0];
    document.body.innerHTML = '';
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'eightQueensStyle.css';
    document.head.append (link);
    // create table element
    const table = document.createElement('table');
    table.className = 'chessboard';
    const label = document.createElement('div');
    label.innerHTML = `<h1>Eight Queens</h1>`;
    document.body.appendChild(label);
  
    // create table header row
    const headerRow = document.createElement('tr');
  
    // add index column
    const indexHeader = document.createElement('th');
    indexHeader.innerText = ' ';
    headerRow.appendChild(indexHeader);
  
    // add column headers
    for (let j = 1; j <= board[0].length - 1; j++) {
      const header = document.createElement('th');
      header.innerText = j;
      headerRow.appendChild(header);
    }
  
    // add header row to table
    table.appendChild(headerRow);
  
    // create table rows
    for (let i = 1; i < board.length; i++) {
      const row = document.createElement('tr');
  
      // add row index
      const indexCell = document.createElement('td');
      indexCell.innerText = board[i][0];
      row.appendChild(indexCell);
  
      // add row cells
      for (let j = 1; j < board[i].length; j++) {
        const cell = document.createElement('td');
        cell.innerText = board[i][j] === 'Q' ? 'Q' : ' ';
        cell.className = (i + j) % 2 === 0 ? 'white' : 'black';
        if (board[i][j] === 'Q') {
          cell.innerHTML = '<img src="DarkQueen.png" width = "20px">';
        }
        row.appendChild(cell);
      }
  
      // add row to table
      table.appendChild(row);
    }
  
    // append table to body
    document.body.appendChild(table);
    let text = document.createElement('div');
    text.className = `Text`;
    let p = game[1];
    text.textContent = `${p} remaining Queens`;
    document.body.appendChild(text);
    let move = document.createElement(`div`);
    move.textContent = `The input form: <position> (ex. a5)`;
    move.className = `Move`;
    document.body.appendChild(move);
  }
  
}

class Sudoku extends GameEngine {

  constructor () {
    super ();
  }

  init () {
    const board = this.generateSudoku();
    const arr = [];
    for (let i = 0; i < 9; i++) {
      arr[i] = [];
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== ' ') {
          arr[i][j] = true;
        } else {
          arr[i][j] = false;
        }
      }
    }
    return [board, arr];
  }

  controller (game, input) {
    if(input==""||input==null){
      return game
  }
    const board = game[0];
    const arr = game[1];
    if (input == '-1') {
      return this.init();
    }
    if (input.length === 2) {
      let i = input[0].charCodeAt (0) - 'a'.charCodeAt (0);
      let j = Number(input[1]) - 1;
      if (i < 0 || i > 8 || j < 0 || j > 8) {
        return [board, arr];
      }
      if (arr[i][j]) {
        return [board, arr];
      }
      board[i][j] = ' ';
      return [board, arr];
    }
    if (input.length < 5) {
      return [board, arr];
    }
    const [n, pos] = input.split(',').map(p => p.trim());
    if (n.length > 1 || pos.length < 2) {
      console.log(`Wrong input`);
      return [board, arr];
    }
    let i = pos[0].charCodeAt (0) - 'a'.charCodeAt (0);
    let j = Number(pos[1]) - 1;
    let num = Number (n);
    if (i < 0 || i > 8 || j < 0 || j > 8 || num < 1 || num > 9) {
      return [board, arr];
    }
    for (let k = 0; k < 9; k++) {
      if (board[i][k] === num || board[k][j] === num) {
        return [board, arr];
      }
    }
  
    // Check if the number is already present in the same 3x3 subgrid
    const subgridRow = Math.floor(i / 3) * 3;
    const subgridCol = Math.floor(j / 3) * 3;
    for (let row = subgridRow; row < subgridRow + 3; row++) {
      for (let col = subgridCol; col < subgridCol + 3; col++) {
        if (board[row][col] === num) {
          return [board, arr];
        }
      }
    }
    board[i][j] = num;
    return [board, arr];
  }

  drawer (game) {
    const board = game[0];
    document.body.innerHTML = '';
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'SudokuStyle.css';
    document.head.append (link);
    const label = document.createElement('div');
    label.innerHTML = `<h1>Sudoku</h1>`;
    const container = document.createElement('div');
    container.classList.add('sudoku-container');
    container.appendChild(label);
  
    // Add row for column numbers
    const columnRow = document.createElement('div');
    columnRow.classList.add('sudoku-row', 'sudoku-row-header');
    const cell = document.createElement('div');
    cell.classList.add('sudoku-cell', 'sudoku-cell-header');
    cell.textContent = ' ';
    columnRow.appendChild(cell);
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.classList.add('sudoku-cell', 'sudoku-cell-header');
      cell.textContent = j + 1;
      columnRow.appendChild(cell);
    }
    container.appendChild(columnRow);
  
    for (let i = 0; i < 9; i++) {
      const row = document.createElement('div');
      row.classList.add('sudoku-row');
      
      // Add cell for row number
      const rowHeader = document.createElement('div');
      rowHeader.classList.add('sudoku-cell', 'sudoku-cell-header');
      rowHeader.textContent = String.fromCharCode(i+'a'.charCodeAt(0));
      row.appendChild(rowHeader);
  
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('div');
        cell.classList.add('sudoku-cell');
        cell.textContent = board[i][j];
        cell.classList.add('sudoku-cell-filled');
        row.appendChild(cell);
      }
      container.appendChild(row);
    }
    document.body.appendChild(container);
    let move = document.createElement(`div`);
    move.textContent = `The input form: <number>, <position> (ex. 4, b2)`;
    move.className = `Move`;
    document.body.appendChild(move);
  }
  
  
  // Define the Sudoku generator function
  generateSudoku() {
    console.log(`generate`);
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    let min = 30, max = 60;
    let random = Math.floor(Math.random() * (max - min + 1)) + min;
    
    function removeRandom(solvedBoard, numToRemove) {
      // Make a copy of the solved board
      const board = solvedBoard.map(row => [...row]);
    
      // Track how many numbers have been removed
      let count = 0;
    
      // Remove numbers until the desired amount have been removed
      while (count < numToRemove) {
        // Choose a random cell
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
    
        // If the cell isn't already empty, remove its value
        if (board[row][col] !== ' ') {
          board[row][col] = ' ';
          count++;
        }
      }
    
      return board;
    }
    
    return removeRandom (solution, random);
  }


}




class chess extends GameEngine{

  constructor(){
  super();    
  }

  init(){


      let role="white";
      let board=[[" "," "," "],
          ["square","rook","black"],["square","knight","black"],["square","bishop","black"],["square","queen","black"],["square","king","black"],["square","bishop","black"],["square","knight","black"],["square","rook","black"],
          ["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],["square","pawn","black"],
          ["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],
          ["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],
          ["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],
          ["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],["square","empty","no"],
          ["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],["square","pawn","white"],
          ["square","rook","white"],["square","knight","white"],["square","bishop","white"],["square","queen","white"],["square","king","white"],["square","bishop","white"],["square","knight","white"],["square","rook","white"]
      ]
      return[board,role]
  }

  
replace(pair,first ,second){
  let y=["square","empty","no"]
  pair[0][second]=pair[0][first];
  pair[0][first]=y;
  return pair
  

}    
  
  drawer(pair){
      
     // document.body.style.background="rgb(30, 36, 50)"
     document.body.innerHTML=`<script src="chess.js" ></script>`
      let all=document.createElement('div');
      all.className='all';
      let text=document.createElement('div')
      text.className='name'
      
      let board=document.createElement('div');
      board.classList.add('board');
  
      let button=document.createElement('button');
      button.className='button';
      button.textContent = `Enter postion of first piece then space then second piece ex:17 16 `;
      let con=document.createElement('div');
          con.className='contain';
      let button2=document.createElement('button');
      button2.className='button';
      button2.id="turn";
      button2.textContent = 'W';
      button2.style.backgroundColor='white';  
           
      for(let i=0;i<9;i++){
        
        let box=document.createElement('div'); 
        box.classList.add('square');
       
        box.textContent=i
        box.style.color='black';
        box.style.backgroundColor='#a7ffa7'; 
        if(i==0){
          box.textContent=""
          box.style.backgroundColor='black'; 
        }
        board.appendChild(box);
      }





      let r=1,count=1;
      for(let i=1;i<=64;i++){
        if(i%8==1){
        let box=document.createElement('div'); 
        box.classList.add('square');
        box.textContent=count++
        box.style.color='black';
        box.style.backgroundColor='#a7ffa7';
        board.appendChild(box);
        }
          let box=document.createElement('div'); 
          box.classList.add('square');
          box.id=i;
          
          board.appendChild(box);
          if(i%2==0&&r%2==1){
          box.style.background='white'
          }
          
          else if(i%2==1&&r%2==0){
              box.style.background='white'
          }
       else{
              box.style.background='#49beb6'
           }

              if(i%8==0){
                  r++;
              }


      }


      con.appendChild(button2);
      con.appendChild(button)
      all.appendChild(text);
      all.appendChild(board);
      all.appendChild(con); 

      text.innerHTML="CHESS"
  
  
      
      document.body.appendChild(all);
      const link = document.createElement('link');
      
  
  // Set the attributes of the link element
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'chess.css';
  document.head.appendChild(link);

  for(let i=1;i<=64;i++){
      let p=document.getElementById(i);
      if(pair[0][i][1]=="empty"){
          p.innerHTML="";
      }
      else if (pair[0][i][1]=="pawn"&&pair[0][i][2]=="black"){

          p.innerHTML="&#9823"
      }
      else if (pair[0][i][1]=="pawn"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9817"
      }
      else if (pair[0][i][1]=="rook"&&pair[0][i][2]=="black"){

          p.innerHTML="&#9820"
      }
      else if (pair[0][i][1]=="rook"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9814"
      }


      else if (pair[0][i][1]=="knight"&&pair[0][i][2]=="black"){

          p.innerHTML="&#x265E"
      }
      else if (pair[0][i][1]=="knight"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9816"
      }

      else if (pair[0][i][1]=="bishop"&&pair[0][i][2]=="black"){

          p.innerHTML="&#9821"
      }
      else if (pair[0][i][1]=="bishop"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9815"
      }


      else if (pair[0][i][1]=="queen"&&pair[0][i][2]=="black"){

          p.innerHTML="&#9819"
      }
      else if (pair[0][i][1]=="queen"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9813"
      } else if (pair[0][i][1]=="king"&&pair[0][i][2]=="black"){

          p.innerHTML="&#9818"
      }
      else if (pair[0][i][1]=="king"&&pair[0][i][2]=="white"){

          p.innerHTML="&#9812"
      } 
      else{
          p.innerHTML=pair[0][i][1]
      }
  }
  
  if(pair[1]=='white'){
              let turn=document.getElementById("turn");
              turn.style.backgroundColor="white";
              turn.innerText='W';
              turn.style.color='black';
                      }
  else if(pair[1]=='black'){
              let turn=document.getElementById("turn");
              turn.style.backgroundColor="black";
              turn.innerText='B';
              turn.style.color='white';
   }
}
  
controller(pair,move){

  if(move==-1){
    return this.init()

  }
  if(move==""||move==null){
      return pair
  }

      let first=parseInt(move[0])+(8*(parseInt(move[1])-1));
      let second=parseInt(move[3])+(8*(parseInt(move[4])-1))



      
          // let from=document.getElementById(this.from);
          // let to =document.getElementById(this.to);

          if(pair[1]!=pair[0][first][2]||pair[0][second][2]==pair[1]){        //check turn and select piece
              return pair;
          }
          else{

              if(pair[0][first][1]=="pawn"&&pair[0][first][2]=="white"){
                  if(first-second==8&&pair[0][second][1]=="empty"){
                      pair=this.replace(pair,first,second);
                      
                  }
                  else if((first-second==9||first-second==7)&&pair[0][second][1]!="empty"&&pair[0][second][2]!="white"){
                     
                    pair=this.replace(pair,first,second);
                  }
                  else{
                      return pair;
                  }

              }
              else if(pair[0][first][1]=="pawn"&&pair[0][first][2]=="black"){
                  if(first-second==-8&&pair[0][second][1]=="empty"){
                      pair=this.replace(pair,first,second) 
                  }
                  else if((first-second==-9||first-second==-7)&&pair[0][second][1]!="empty"&&pair[0][second][2]!="black"){
                     
                      pair=this.replace(pair,first,second);

                  }
                  else{
                      return pair;
                  }

              }

              else if(pair[0][first][1]=="knight"){
              
                  if((first-second==15||first-second==17||first-second==-15||first-second==-17||first-second==10||first-second==-10||first-second==6||first-second==-6)){
                     
                      pair=this.replace(pair,first,second);
                  }
                  else{
                      return pair;
                  }
              }
              else if(pair[0][first][1]=="king"){
              
                  if(first-second==1||first-second==-1||first-second==8||first-second==-8||first-second==7||first-second==-7||first-second==9||first-second==-9){
                     
                      pair=this.replace(pair,first,second);
                  }
                  else{
                      return pair;
                  }
              }

              else if(pair[0][first][1]=="rook"){
                  let x=parseInt(second, 10);
                  let y=parseInt(first, 10);
                  let i=1,t=10;
                  let l=1,u=8,up=1,down=57;
                  let f1=1,f2=1,f3=1,f4=1;

                  while(true){
                      if(l<=y&&y<=u){
                          break;
                      }
                      l=u+1;
                      u+=8;
                  }

                  while(true){
                      if(up<=y&&y<=down){
                          break;
                      }
                      up++;
                      down++;
                  }

                  console.log(u+" "+l)
                  while(t){
                      if((y+i*8)<=down&&document.getElementById(y+i*8).textContent!=""&&document.getElementById(y+i*8).id!=second){
                          f1=0;
                      }
                     if((y+i*8)==x&&f1==1){
                          break;

                      }
                      if((y-i*8)>=up&&document.getElementById(y-i*8).textContent!=""&&document.getElementById(y-i*8).id!=second){
                          f2=0;
                      }
                      if((y-i*8)==x&&f2==1){
                          break;
                      }
                      if(l<=(y+i*1)&&(y+i*1)<=u&&document.getElementById(y+i*1).textContent!=""&&document.getElementById(y+i*1).id!=second){
                          f3=0;
                      }
                      if((y+i*1)==x &&l<=(y+i*1)&&(y+i*1)<=u&&f3==1){
                          break
                      }
                      if((l<=(y-i*1))&&((y-i*1)<=u)&&document.getElementById(y-i*1).textContent!=""&&document.getElementById(y-i*1).id!=second){
                          f4=0;
                      }
                      if((y-i*1)==x&&(l<=(y-i*1))&&((y-i*1)<=u)&&f4==1){
                      break;
                      }
                  i++
                  t--
                  }
                  if(t!=0){
                      pair=this.replace(pair,first,second);

                  }
                  else if(t==0){ //can't go to this position
                      this.from='';
                      this.to='';
                      return pair
                  }
              }
              else if(pair[0][first][1]=="queen"){
                  let x=parseInt(second, 10);
                  let y=parseInt(first, 10);
                  let i=1,t=16,up=1,down=57;
                  let l=1,u=8 ;
                  let f1=1,f2=1,f3=1,f4=1,f5=1,f6=1,f7=1,f8=1;


                  while(true){
                      if(l<=y&&y<=u){
                          break;
                      }
                      l=u+1;
                      u+=8;
                  }
                  while(true){
                      if(up<=y&&y<=down){
                          break;
                      }
                      up++;
                      down++;
                  }
                  while(t){

                      if((y+i*9)<=down&&document.getElementById(y+i*9).textContent!=""&&document.getElementById(y+i*9).id!=second){
                          f5=0;
                      }
                      if((y+i*9)==x&&f5==1){
                          break;

                      }
                      
                      if((y-i*9)>=up&&document.getElementById(y-i*9).textContent!=""&&document.getElementById(y-i*9).id!=second){
                          f6=0;
                      }
                      if((y-i*9)==x&&f6==1){
                          break;

                      }
                      if((y+i*7)<=down&&document.getElementById(y+i*7).textContent!=""&&document.getElementById(y+i*7).id!=second){
                          f7=0;
                      }
                      if((y+i*7)==x&&f7==1){
                          break;

                      }
                      if((y-i*7)>=up&&document.getElementById(y-i*7).textContent!=""&&document.getElementById(y-i*7).id!=second){
                          f8=0;
                      }
                      if((y-i*7)==x&&f8==1){
                          break;

                      }
                      
                      if((y+i*8)<=down&&document.getElementById(y+i*8).textContent!=""&&document.getElementById(y+i*8).id!=second){
                          f1=0;
                      }
                     if((y+i*8)==x&&f1==1){
                          break;

                      }
                      if((y-i*8)>=up&&document.getElementById(y-i*8).textContent!=""&&document.getElementById(y-i*8).id!=second){

                          f2=0;
                      }
                      if((y-i*8)==x&&f2==1){
                          break;
                      }
                      if(l<=(y+i*1)&&(y+i*1)<=u&&document.getElementById(y+i*1).textContent!=""&&document.getElementById(y+i*1).id!=second){
                          f3=0;
                      }
                      if((y+i*1)==x &&l<=(y+i*1)&&(y+i*1)<=u&&f3==1){
                          break
                      }
                      if((l<=(y-i*1))&&((y-i*1)<=u)&&document.getElementById(y-i*1).textContent!=""&&document.getElementById(y-i*1).id!=second){
                          f4=0;
                      }
                      if((y-i*1)==x&&(l<=(y-i*1))&&((y-i*1)<=u)&&f4==1){
                      break;
                      }
                  i++
                  t--
                  }
                  if(t!=0){
                      pair=this.replace(pair,first,second);

                  }
                  else if(t==0){ //can't go to this position
                      return pair
                  }
              }

              else if(pair[0][first][1]=="bishop"){
                  let x=parseInt(second, 10);
                  let y=parseInt(first, 10);
                  let i=1,t=16,up=1,down=57;
                  let l=1,u=8 ;
                  let f5=1,f6=1,f7=1,f8=1; 

                  while(true){
                      if(l<=y&&y<=u){
                          break;
                      }
                      l=u+1;
                      u+=8;
                  }
                  while(true){
                      if(up<=y&&y<=down){
                          break;
                      }
                      up++;
                      down++;
                  }                  
                  
                    while(t){
                      if((y+i*9)<=down&&document.getElementById(y+i*9).textContent!=""&&document.getElementById(y+i*9).id!=second){
                          f5=0;
                      }
                      if((y+i*9)==x&&f5==1){
                          break;

                      }
                      if((y-i*9)>=up&&document.getElementById(y-i*9).textContent!=""&&document.getElementById(y-i*9).id!=second){
                          f6=0;
                      }
                      if((y-i*9)==x&&f6==1){
                          break;

                      }
                      if((y+i*7)<=down&&document.getElementById(y+i*7).textContent!=""&&document.getElementById(y+i*7).id!=second){
                          f7=0;
                      }
                      if((y+i*7)==x&&f7==1){
                          break;

                      }      
                      
                      if((y-i*7)>=up&&document.getElementById(y-i*7).textContent!=""&&document.getElementById(y-i*7).id!=second){
                          f8=0;
                      }
                      
                      if((y-i*7)==x&&f8==1){
                          break;

                      }
                  i++
                  t--
                  }
                  if(t!=0){
                      pair=this.replace(pair,first,second);

                  }
                  else if(t==0){ //can't go to this position
                      return pair
                  }
              }

          }
          
          if(pair[1]=='white'){
              pair[1]='black';
              let turn=document.getElementById("turn");
              turn.style.backgroundColor=this.role;
              turn.innerText='B';
              turn.style.color='white';
                      }
          else if(pair[1]=='black'){
              pair[1]='white';
              let turn=document.getElementById("turn");
              turn.style.backgroundColor=this.role;
              turn.innerText='W';
              turn.style.color='black';
              console.log(turn.innerHTML);
           }


   return pair

  }
}



class tic_tac_toe extends GameEngine{

    
   
  constructor(){
      super();
  }
  
   init(){
          let role="x"
          let board = ['1', '2', '3', '4','5', '6', '7', '8','9'];
          return [board,role]
          
  
      }
  
  
  drawer(pair){
  
  
      document.body.innerHTML=`<script src="tic_tac_toe.js"></script>`
  
     // document.body.style.background="rgb(30, 36, 50)"
      let all=document.createElement('div');
      all.className='all';
      let text=document.createElement('div')
      text.className='name'
      let board=document.createElement('div');
      board.classList.add('board');
  
      let button=document.createElement('button');
      button.className='button';
      button.textContent = 'Enter postion of box ex:1';
      let con=document.createElement('div');
          con.className='contain';
      let button2=document.createElement('button');
      button2.className='button';
      button2.id="turn";
      button2.textContent = 'X';
  
      
      // let input=document.createElement('input');
      // input.id="input";
      // input.type="text";
      // input.placeholder="enter cell";
      
  
  
      for(let i=0;i<9;i++){
          let box=document.createElement('div'); 
          box.classList.add('square');
          box.id=i;
          // box.addEventListener("click", function() {
          //     this.controller(i);
          //   }.bind(this));
          board.appendChild(box);
      }
      con.appendChild(button2);
      con.appendChild(button)
      all.appendChild(text);
      all.appendChild(board);
      all.appendChild(con);  
      document.body.appendChild(all);
      const link = document.createElement('link');
  
      for(var i=0;i<9;i++){
              let box=document.getElementById(i+"");
              box.textContent=pair[0][i] 
      
          if(pair[0][i] =='x'){
          box.style.color='#49beb6';  //x play
          box.style.fontSize=200;
          let turn=document.getElementById("turn").textContent=pair[1];
      
          }
          else if(pair[0][i] =='o'){
              box.style.color='#a7ffa8';   //o play
              box.style.fontSize=200;
              let turn=document.getElementById("turn").textContent=pair[1];
          }
  
      }
  
      // button.addEventListener("click", function() {
      //     this.controller(-1);
      //   }.bind(this));
      
      text.innerHTML="Tic_Tac_Toc"
  
  // Set the attributes of the link element
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'tic_tac_toe.css';
  
  document.head.appendChild(link);
  
  }
  
  controller(pair,move){
      
      if(move==-1){
        return this.init()
    
      }
      move--;
      if(move<1&&move>9){
        return pair
      }
        
        let input=move
      if(pair[0][input]!='x'&&(pair[0][input]!='o')){
          pair[0][input] =pair[1]
        }
      else {
          return pair;
      }
      if(pair[1]=='x'){
      
      pair[1]='o';
  
      }
      else if(pair[1]=='o'){
          pair[1]='x';
      }
  
      return pair;
  
  };
  
  
  
  
  
  }
  class connect_four extends GameEngine{
  
  
  
  
      constructor(){
          super();
      }
      init(){  
          let role="#49beb6";
          let board=[" ","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42"]
          let text="to close game enter -2"
          return [board,role,"",text]
      }
      drawer(pair){
  
       document.body.innerHTML=`<script src="tic_tac_toe.js"></script>`
        // document.body.style.background="rgb(30, 36, 50)"
      let all=document.createElement('div');
      all.className='all';
      let text=document.createElement('div')
      text.className='name'
      let board=document.createElement('div');
      board.classList.add('board');
      let button=document.createElement('button');
      button.className='button';
      button.textContent = 'Enter postion of coulmn ex:1';
      let button2=document.createElement('button');
      button2.className='button';
      button2.id="turn";
      button2.textContent = 'turn';
      button2.style.backgroundColor='#49beb6';
      let con=document.createElement('div');
       con.className='contain';
      
      
      
   con.appendChild(button2);
      con.appendChild(button)
      all.appendChild(text);
      all.appendChild(board);
      all.appendChild(con);  
  document.body.appendChild(all);

  for(let i=1;i<=7;i++){
    let box=document.createElement('div'); 
    box.classList.add('square');
    box.style.color='black';
    box.style.backgroundColor='#faffa3'; 
    box.textContent=i
    board.appendChild(box);
  }
  
      for(let i=1;i<=42;i++){
          let box=document.createElement('div'); 
          box.classList.add('square');
          box.id=i;
          board.appendChild(box);
      }
  
  
      for(let i=1;i<=42;i++){
          let box=document.getElementById(i); 
  
      if(pair[0][i]=="#49beb6"){
  
          let turn=document.getElementById("turn").style.backgroundColor=pair[1];
          box.style.backgroundColor=pair[0][i];
          box.innerText="";
      }
      else if(pair[0][i]=="#a7ffa7"){
          box.style.backgroundColor=pair[0][i];
          box.innerText="";
          let turn=document.getElementById("turn").style.backgroundColor=pair[1];
      }
      else{
          
          // box.innerText=pair[0][i];
          box.style.color='rgba(150, 141, 138, 0.533)'
        }
  
      }
  
      text.innerHTML="Connect-Four"
  
  
    
      const link = document.createElement('link');
      
  
  // Set the attributes of the link element
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'connect_four.css';
  
  document.head.appendChild(link);
  
  
  }
  
  
  controller(pair,move){

    if(move==-1){
      return this.init()
    }
    else if(move==""||move==null){
      return pair;
    }

    let input=move
  
      if(input>42||input<=0){
          return pair;
      }
      let place=(input%7)+35;
      if(input%7==0){
          place+=7;
      }
  
      let flage=0;
  
      for(let i=1;i<=6;i++){
          // let p=document.getElementById(place);
  
          if(pair[0][place]!='#a7ffa7'&&pair[0][place]!='#49beb6'){
              pair[0][place]=pair[1];
              flage=1
              break;
          }
          place=place-7;
      }
      if(flage==0){
          alert("NO place in this column to play in it");
          return pair;
      }
      
      if(pair[1]=="#a7ffa7"){
          pair[1]="#49beb6";
          }
      else if(pair[1]=="#49beb6"){
          pair[1]="#a7ffa7";
          
      }
  
  
  
  
  
  return pair
      
  
  
  }
  
  
  }
  
  
  async function main () {
  let choice = null;
  while(true){
  await new Promise(resolve => setTimeout(resolve, 1000));
  choice = prompt('Enter the name of the game:');
    if(choice>=1&&choice<=6){
      break
    }
  }
  switch (choice) {
    case '1':
      a = new tic_tac_toe ();
      break;
    case '2':
      a = new connect_four ();
      break;
    case '3':
      a = new chess ();
      break;
    case '4':
      a = new EightQueens ();
      break;
    case '5':
      a = new checkers ();
      break;
    case '6':
      a = new Sudoku ();
      break;
  }
}


    

main();