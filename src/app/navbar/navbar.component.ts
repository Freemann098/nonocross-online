import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { GramDatabaseService } from '../services/gram-database.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  @Output() toggleSidebarEvt = new EventEmitter();

  showLoginButton: boolean = false;
  loggedIn: boolean = false;

  userAvatarUrl: string = "";

  constructor(private auth:Auth, public dialog: MatDialog, private db: GramDatabaseService) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(
      res => {
        if (res?.getIdToken) {
          this.loggedIn = true;
          this.db.userProfileDoc.valueChanges().subscribe((url) => {
            this.userAvatarUrl = url?.avatar_url!;
          });
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
