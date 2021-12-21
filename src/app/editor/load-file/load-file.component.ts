import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.sass']
})
export class LoadFileComponent {

  constructor() { }

  fileData: any;

  @Output() fileEvent = new EventEmitter<string>();
  @Output() errorEvent = new EventEmitter<string>();

  fileChanged(e: any) {
    //check if it is a txt file
    if (e.target.files[0].name.includes('.txt')) {
      this.fileData = e.target.files[0];
    } else {
      this.errorEvent.emit("File error: invalid file type, please import a .txt file");
    }
  }

  uploadFile() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      this.fileEvent.emit(fileReader.result as string);
    }
    fileReader.readAsText(this.fileData);
  }
}
