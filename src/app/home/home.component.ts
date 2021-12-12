import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

interface sizeOption {
  value: number,
  viewValue: string
}

interface difficultyOption {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  difficultyOptions: difficultyOption[] = [
    { value: 0, viewValue: "Easy" },
    { value: 1, viewValue: "Normal" },
    { value: 2, viewValue: "Hard" } ,
    { value: 3, viewValue: "Random" }
  ];
  selectedDifficultyOption: number = this.difficultyOptions[0].value;
  newDifficultyOption: number = this.selectedDifficultyOption;

  sizeOptions: sizeOption[] = [
    { value: 5, viewValue: "5x5" },
    { value: 10, viewValue:"10x10" },
    { value: 15, viewValue: "15x15" },
    { value: 20, viewValue: "20x20" },
    { value: 25, viewValue: "25x25" },
    { value: 30, viewValue: "30x30" },
  ];
  selectedSizeOption: number = this.sizeOptions[0].value;
  newSizeOption: number = this.selectedSizeOption;

  isLoggedIn: boolean = false;

  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(
      () => {
        this.isLoggedIn = true;
      }
    )
  }

}
