import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { GramDatabaseService } from '../services/gram-database.service';

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
  publishError: boolean = false;

  loadedFile!: string;
  puzzleName: string = "nonogram";
  errorMessage: string = "";

  constructor( private auth: Auth, private gramdb: GramDatabaseService, public dialog: MatDialog ) { }

  ngOnInit(): void {
    this.initBoard();

    this.auth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.isLoggedin = true;
        }
      }
    );
  }

  initBoard() {
    this.isLoading = true;
    this.board = [];
    this.generateBoard();
    this.isLoading = false;
  }

  generateBoard() {
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

  //save gram to gram database
  publishGram() {
    const solutionString: string = this.board.toString().replace(/[,]/g, '');
    const confirmDialogRef = this.dialog.open(PublishDialog);

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result == "true") {
        this.gramdb.addCustomGram({
          name: this.puzzleName,
          solution: solutionString,
          author: this.auth.currentUser?.uid!
        }).then(() => {
          window.location.reload();
        }).catch((error) => {
          if (error == false) {
            this.publishError = true;
          }
          else {
            console.log(error);
          }
        });
      }
    });
  }

  openGram() {
    const openDialogRef = this.dialog.open(OpenDialog);

    openDialogRef.afterClosed().subscribe(result => {

    });
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

@Component({
  selector: 'dialog-publish-dialog',
  templateUrl: 'publish-dialog.html',
})
export class PublishDialog {}

@Component({
  selector: 'dialog-open-dialog',
  templateUrl: 'open-dialog.html',
})
export class OpenDialog {}
