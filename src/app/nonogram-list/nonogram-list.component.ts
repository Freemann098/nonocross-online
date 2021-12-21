import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CustomGram } from '../services/custom-gram';
import { GramDatabaseService } from '../services/gram-database.service';

@Component({
  selector: 'app-nonogram-list',
  templateUrl: './nonogram-list.component.html',
  styleUrls: ['./nonogram-list.component.sass']
})
export class NonogramListComponent implements OnInit {

  @Output() openNonogramEvent: EventEmitter<CustomGram> = new EventEmitter();

  iconTrash = faTrash;

  customGrams: CustomGram[] = [];

  constructor(private auth: Auth, private gramdb: GramDatabaseService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  gramClicked(gram: CustomGram) {
    this.openNonogramEvent.emit(gram);
  }

  deleteGram(gram: CustomGram) {
    const deleteDialogRef = this.dialog.open(DeleteDialog, {data: {gramName: gram.name}});

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result == "true") {
        this.gramdb.deleteCustomGram(gram).then(() => {
          window.location.reload();
        });
      }
    });
  }

  getData() {
    this.auth.onAuthStateChanged(
      () => {
        this.gramdb.userGrams.subscribe(
          (res) => {
            res.forEach((gram) => {
              this.customGrams.push(gram);
            });
          }
        );
      }
    );
  }
}

@Component({
  selector: 'dialog-delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {gramName: string}) {}
}
