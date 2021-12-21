import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { GramDatabaseService } from '../services/gram-database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  userAvatarUrl: string = "";
  username: string = "";
  usernameInput: string = "";
  avatarUrlInput: string = "";

  constructor(private auth: Auth, private db: GramDatabaseService) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(
      res => {
        if (res?.getIdToken) {
          this.db.userProfileDoc.valueChanges().subscribe((user) => {
            this.userAvatarUrl = user?.avatar_url!;
            this.avatarUrlInput = user?.avatar_url!;
            this.username = user?.username!;
            this.usernameInput = user?.username!;
          });
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  updateProfile() {
    this.db.updateUserAvatar(this.auth.currentUser?.uid!, this.avatarUrlInput);

    this.db.updateUsername(this.auth.currentUser?.uid!, this.usernameInput)
      .then((res) => {
        console.log(res);
      });
  }
}
