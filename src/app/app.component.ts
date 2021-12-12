import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{

  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'nonocross-online';

  showLoginButton: boolean = false;
  loggedIn: boolean = false;

  //default avatar, if user signs in with google, retreive google account avatar below
  userAvatarUrl: string = "https://www.teenwiseseattle.com/wp-content/uploads/2017/04/default_avatar.png";

  constructor(private auth:Auth, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(
      res => {
        if (res?.getIdToken) {
          this.loggedIn = true;
          if (res.photoURL) {
            this.userAvatarUrl = res.photoURL;
          }
        } else {
          this.showLoginButton = true;
          this.loggedIn = false;
        }
      },
      err => {
        console.error(err);
      }
    );

  }

  closeSidenav(): void {
    this.sidenav.close();
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }

  async logout() {
    await signOut(this.auth);
    window.location.reload();
  }
}
