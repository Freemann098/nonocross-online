import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebarEvt = new EventEmitter();

  showLoginButton: boolean = false;
  loggedIn: boolean = false;

  //default avatar, if user signs in with google, retreive google account avatar below
  userAvatarUrl: string = "https://www.teenwiseseattle.com/wp-content/uploads/2017/04/default_avatar.png";

  constructor(private auth:Auth, public dialog: MatDialog) { }

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

  toggleSidebar(): void {
    this.toggleSidebarEvt.emit();
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }

  async logout() {
    await signOut(this.auth);
    window.location.reload();
  }

}
