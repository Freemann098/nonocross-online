import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.sass']
})
export class GameboardComponent implements OnInit {

  //Size of board, full board is squared
  @Input() boardSize: number = 5;

  //Full solution array, compared with board in checkSolution()
  @Input() solution: number[] = [];

  //Difficulty 0=easy  1=normal 2=hard 3=random
  @Input() difficulty: number = 0;

  hasSolved: boolean = false;

  //guess board, changes based on what tiles user clicks, 0 or 1
  board: number[] = [];

  //Hints for rows and columns
  rowHints: number[][] = [];
  colHints: number[][] = [];

  //Keep track of highest number of hints so we know how many empty spaces to generate
  highestNumRowHints: number = 0;
  highestNumColHints: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard() {
    this.generateBoard();
    this.generateHints();
  }

  generateBoard(): void {
    let numTiles = (this.boardSize*this.boardSize);

    //Generate random solution based on diffictuly if no solution was inputed
    if (this.solution.length == 0) {
      let streak = 0;

      for (let i = 0; i < numTiles; i++) {
        let chanceOfFill = 0;
        let ranNum = Math.floor((Math.random() * 100) + 1);

        //Basic difficulty algorithm to determine frequency of multiple filled tiles, could be improved
        switch (this.difficulty) {
          case 0:
            chanceOfFill = 100 - (streak * (100 / this.boardSize));
            break;
          case 1:
            chanceOfFill = 100 - (streak * ((100 / this.boardSize) * 3));
            break;
          case 2:
            chanceOfFill = 100 - (streak * ((100 / this.boardSize) * 5));
            break;
          case 3:
            chanceOfFill = 50;
            break;
        }

        if (ranNum <= chanceOfFill) {
          this.solution.push(1);
          streak++;
        } else {
          this.solution.push(0);
          streak = 0;
        }
      }
      //50/50 random solution for each tile
      if (this.difficulty == 3) {
        for (let i = 0; i < numTiles; i++) {
          let ranNum = Math.floor(Math.random() * 2);
          this.solution.push(ranNum);
        }
      }
    }

    //Fill board with 0s
    for (let i = 0; i < numTiles; i++) {
      this.board.push(0);
    }
  }

  generateHints() {
    //Get hints for the columns
    for (let x = 0; x < this.boardSize; x++) {
      let streak = 0;
      let streakEnded = false;
      let hints = [];

      for (let y = 0; y < this.boardSize; y++) {
        if (this.solution[(y*this.boardSize) + x] == 1) {
          if (streakEnded) {
            streakEnded = false;
          }
          streak++;
        } else {
          if (!streakEnded && streak > 0) {
            streakEnded = true;
            hints.push(streak);
            streak = 0;
          }
        }
      }

      if (!streakEnded) {
        streakEnded = true;
        hints.push(streak);
        streak = 0;
      }

      if (hints.length > this.highestNumColHints) {
        this.highestNumColHints = hints.length;
      }

      this.colHints.push(hints);
      hints = [];
    }

    //Get hints for the rows
    for (let y = 0; y < this.boardSize; y++) {
      let streak = 0;
      let streakEnded = false;
      let hints = [];

      for (let x = 0; x < this.boardSize; x++) {
        if (this.solution[(y*this.boardSize) + x] == 1) {
          if (streakEnded) {
            streakEnded = false;
          }
          streak++;
        } else {
          if (!streakEnded && streak > 0) {
            streakEnded = true;
            hints.push(streak);
            streak = 0;
          }
        }
      }

      if (!streakEnded) {
        streakEnded = true;
        hints.push(streak);
        streak = 0;
      }

      if (hints.length > this.highestNumRowHints) {
        this.highestNumRowHints = hints.length;
      }

      this.rowHints.push(hints);
      hints = [];
    }

    this.fixHintsForDisplay();
  }

  //Due to way the hints are printed with ngFor as a grid, need to fill the 0 hint spots with 0s
  fixHintsForDisplay(): void {
    //columns
    for (let i = 0; i < this.colHints.length; i++) {
      let tempHintArray = [];

      for (let l = 0; l < this.highestNumColHints; l++) {
        tempHintArray.push(0);
      }

      for (let j = 0; j < this.colHints[i].length; j++) {
        tempHintArray[(tempHintArray.length-1)-j] = this.colHints[i][(this.colHints[i].length-1)-j];
      }

      this.colHints[i] = tempHintArray;
    }

    //rows
    for (let i = 0; i < this.rowHints.length; i++) {
      let tempHintArray = [];

      for (let l = 0; l < this.highestNumRowHints; l++) {
        tempHintArray.push(0);
      }

      for (let j = 0; j < this.rowHints[i].length; j++) {
        tempHintArray[(tempHintArray.length-1)-j] = this.rowHints[i][(this.rowHints[i].length-1)-j];
      }

      this.rowHints[i] = tempHintArray;
    }
  }

  resetBoard(solution?: number[]) {
    this.board = [];
    this.solution = [];
    if (solution) {
      this.solution = solution!;
    }
    this.colHints = [];
    this.rowHints = [];
    this.highestNumColHints = 0;
    this.highestNumRowHints = 0;
    this.initBoard();
  }

  newBoard(size: number, difficulty: number, solution?: number[]) {
    this.boardSize = size;
    this.difficulty = difficulty;
    this.resetBoard(solution);
  }

  tileClicked(tileIndex: number) {
    if (this.board[tileIndex] == 0) {
      this.board[tileIndex] = 1;
    } else {
      this.board[tileIndex] = 0;
    }

    this.checkSolution();
  }

  checkSolution() {
    let numIncorrect = 0;

    //Compare board with solution, count incorrect tiles
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] != this.solution[i]) {
        numIncorrect++;
      }
    }

    //If no incorrect tiles, puzzle solved
    if (numIncorrect == 0) {
      this.hasSolved = true;
    } else {
      this.hasSolved = false;
    }
  }

  counter(i: number) {
    return new Array(i);
  }
}
