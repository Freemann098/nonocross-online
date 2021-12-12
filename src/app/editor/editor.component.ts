import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { saveAs } from 'file-saver';

interface sizeOption {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit {

  constructor( private auth: Auth ) { }

  sizeOptions: sizeOption[] = [
    {value: 5, viewValue:"5x5"},
    {value: 10, viewValue:"10x10"},
    {value: 15, viewValue:"15x15"},
    {value: 20, viewValue:"20x20"},
    {value: 25, viewValue:"25x25"},
    {value: 30, viewValue:"30x30"},
  ];

  selectedSizeOption: number = this.sizeOptions[0].value;

  board: number[] = [];

  isLoading: boolean = true;
  isLoggedin: boolean = false;
  gotError: boolean = false;

  loadedFile!: string;
  puzzleName: string = "nonogram";
  errorMessage: string = "";

  ngOnInit(): void {
    this.initBoard();

    if (this.auth.currentUser) {
      this.isLoggedin = true;
    }
  }

  async initBoard() {
    this.isLoading = true;
    this.board = [];
    await this.generateBoard();
    this.isLoading = false;
  }

  async generateBoard() {
    let numTiles = (this.selectedSizeOption * this.selectedSizeOption);

    for (let i = 0; i < numTiles; i++) {
      this.board.push(0);
    }
  }

  selectSize(event: Event) {
    this.selectedSizeOption = parseInt((event.target as HTMLSelectElement).value);
  }

  tileClicked(tileIndex: number) {
    if (this.board[tileIndex] == 0) {
      this.board[tileIndex] = 1;
    } else {
      this.board[tileIndex] = 0;
    }
  }

  //Put board values in string and save as txt file
  exportBoardAsTxt() {
    let exportString = "";

    for (let i = 0; i < this.board.length; i++) {
      exportString += this.board[i].toString();
    }

    const blob = new Blob([
      exportString],
      {type: "text/plain;charset=utf-8"}
    );
    saveAs(blob, (this.puzzleName + "-nonogram.txt"));
  }

  receiveFile($event: any) {
    this.loadedFile = $event;
    this.parseFile();
  }

  receiveError($event: any) {
    this.gotError = true;
    this.errorMessage = $event;
  }

  parseFile() {
    let fileLength = this.loadedFile.length;

    //Check if imported file is correct size for selected board size
    if (fileLength < this.board.length) {
      this.gotError = true;
      this.errorMessage = "Import error: insufficient amount of data for current grid size, import length: " + fileLength;
    } else if ( fileLength > this.board.length) {
      this.gotError = true;
      this.errorMessage = "Import error: too much data for current grid size, import length: " + fileLength;
    } else {
      this.gotError = false;
      this.errorMessage = "";

      for (let i = 0; i < fileLength; i++) {
        this.board[i] = parseInt(this.loadedFile[i]);
      }
    }

  }
}
