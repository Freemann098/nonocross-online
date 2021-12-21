import { Component, OnInit } from '@angular/core';
import { Auth, getRedirectResult } from '@angular/fire/auth';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { GramDatabaseService } from './services/gram-database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{

  title = 'nonocross-online';
  version = "v0.0.2";
  iconGithub = faGithub;

  constructor(private auth: Auth, private db: GramDatabaseService) {}

  ngOnInit(): void {
    getRedirectResult(this.auth)
      .then((res) => {
        if (res) {
          this.db.addUserProfile({
            username: res.user.displayName!,
            id: res.user.uid,
            avatar_url: res.user.photoURL!,
            favorite_grams: [],
          });
        }
      }).catch((err => {
        console.log(err.message);
      })
    );
  }
}
