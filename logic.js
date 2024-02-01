// Tic Tac Toe with Medium AI
// ver 1.0
// Author: Michael Whyte
//
// AI.getBestMove() and GAME.checkwin() code modified
// from code found at:
//
// http://aharrisbooks.net/h5g/h5g_13/tictactoe/tttAI.html
//
// AI.getBestMove() and GAME.checkwin() code based on
// lessons learned from the book:
// HTML5 Game Development for Dummies
// by: Andy Harris
//
// Game Object
//
// 1. initialize the game
// --a: clear the game board
// --b: clear the board array
// --c: clear the data-played attributes
//
// 2. store the game board array
//
// 3. store the winning combinations
//
// 4. update the game board
//
// 5. Check for winner
//
// 6. Store game state variables

var GAME = {
   // Game State variables
   isComputerPlaying: false,
   isGameOver: false,
   numberOfPlayedSquares: 0,

   // original Game Board;
   gameBoard: [null, null, null, null, null, null, null, null, null],

   // the HTML game square elements
   squares: $(".square"),

   winningCombos: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ],

   // update the Game board array
   updateGameBoard: function (index, value, el) {
      this.gameBoard[index] = value;
      el.html(value);
   }, // end updateGameBoard

   // initialize the game
   init: function () {
      // clear the squares
      this.squares.each(function () {
         $(this).html("");
      });

      this.gameBoard = [null, null, null, null, null, null, null, null, null];
      this.isComputerPlaying = false;
      this.isGameOver = false;
      this.numberOfPlayedSquares = 0;
   }, // end GAME.init()

   checkWin: function (value) {
      var winner = false;

      for (var combo = 0; combo < this.winningCombos.length; combo++) {
         var a = this.winningCombos[combo][0];
         var b = this.winningCombos[combo][1];
         var c = this.winningCombos[combo][2];

         if (GAME.gameBoard[a] === GAME.gameBoard[b]) {
            if (GAME.gameBoard[b] === GAME.gameBoard[c]) {
               if (GAME.gameBoard[a] !== null) {
                  this.endGame(value);
                  winner = true;
               } // end if
            } // end if
         } // end if
      } // end for

      return winner;
   },

   endGame: function (value) {
      if (value === "X") {
         alert("Congratulations you won!!!");
      } else if (value === "O") {
         alert("The Computer won");
      } else {
         alert("It's a draw...");
      }

      this.isGameOver = true;

      var playAgain = confirm("Click Ok to play again...");

      if (playAgain === true) {
         this.init();
      }
   },
}; // end GAME

// AI Object
//
// 1. play turn
// --a: choose best square to play

var AI = {
   getBestMove: function () {
      // use a heuristic algorithm to determine the best play

      //initial rank based on number of winning combos
      //that go through the cell
      var cellRank = [3, 2, 3, 2, 4, 2, 3, 2, 3];

      //demote any cells already taken
      for (var i = 0; i < GAME.gameBoard.length; i++) {
         if (GAME.gameBoard[i] !== null) {
            cellRank[i] -= 99;
         } // end if
      } // end for

      //look for partially completed combos
      for (var combo = 0; combo < GAME.winningCombos.length; combo++) {
         var a = GAME.winningCombos[combo][0];
         var b = GAME.winningCombos[combo][1];
         var c = GAME.winningCombos[combo][2];

         //if any two cells in a combo are
         //non-blank and the same value,
         //promote the remaining cell
         if (GAME.gameBoard[a] === GAME.gameBoard[b]) {
            if (GAME.gameBoard[a] !== null) {
               if (GAME.gameBoard[c] === null) {
                  cellRank[c] += 10;
               } // end if
            } // end if
         } // end if

         if (GAME.gameBoard[a] === GAME.gameBoard[c]) {
            if (GAME.gameBoard[a] !== null) {
               if (GAME.gameBoard[b] === null) {
                  cellRank[b] += 10;
               } // end if
            } // end if
         } // end if

         if (GAME.gameBoard[b] === GAME.gameBoard[c]) {
            if (GAME.gameBoard[b] !== null) {
               if (GAME.gameBoard[a] === null) {
                  cellRank[a] += 10;
               } // end if
            } // end if
         } // end if
      } // end for

      //determine the best move to make
      var bestCell = -1;
      var highest = -999;

      //step through cellRank to find the best available score
      for (var j = 0; j < GAME.gameBoard.length; j++) {
         if (cellRank[j] > highest) {
            highest = cellRank[j];
            bestCell = j;
         } // end if
      } // end for

      return bestCell;
   },

   playTurn: function () {
      GAME.isComputerPlaying = true;

      var theSquareToPlay = this.getBestMove();

      var $theSelectedSquare = $(".square-0" + theSquareToPlay);

      GAME.numberOfPlayedSquares++;
      // slow the computer down a bit
      setTimeout(function () {
         GAME.updateGameBoard(theSquareToPlay, "O", $theSelectedSquare);
         GAME.checkWin("O");
         GAME.isComputerPlaying = false;
      }, 500);
   }, // end playTurn()
}; // end AI

// Click event handlers
GAME.squares.click(function () {
   var squareIndexValue = parseInt($(this).data("index"));

   function checkIfTurnIsReady() {
      if (GAME.isGameOver) {
         return false;
      }
      if (GAME.isComputerPlaying) {
         return false;
      }
      if (GAME.gameBoard[squareIndexValue] === null) {
         return true;
      }
   }

   var isTurnReady = checkIfTurnIsReady();

   if (isTurnReady) {
      GAME.updateGameBoard(squareIndexValue, "X", $(this));
      GAME.numberOfPlayedSquares++;
      var winner = GAME.checkWin("X");
      if (winner === false && GAME.numberOfPlayedSquares < 9) {
         AI.playTurn();
      } else if (GAME.numberOfPlayedSquares === 9) {
         GAME.endGame("draw");
      }
   } // endif isTurnReady
}); // end GAME.squares.click event handler
