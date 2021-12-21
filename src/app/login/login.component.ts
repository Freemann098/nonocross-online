import { Component, OnInit, Optional } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, getRedirectResult, GoogleAuthProvider, sendEmailVerification } from '@angular/fire/auth';
import { EmailAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from '@firebase/auth';
import { GramDatabaseService } from '../services/gram-database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private auth: Auth, private router: Router, private db: GramDatabaseService) { }

  //default avatar when new profile is made
  defaultAvatar: string = "http://chasersmith.com/data-dungeon/defaultavatar.png";

  loginInputShow: boolean = true;
  signupInputShow: boolean = false;
  gotError: boolean = false;

  errorMessage: string = "";

  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required, Validators.minLength(4)]);
  password = new FormControl('', Validators.required);
  hidePassword = true;

  ngOnInit(): void {

  }

  showLoginInput(): void {
    this.loginInputShow = true;
    this.signupInputShow = false;
  }

  showSignupInput(): void {
    this.signupInputShow = true;
    this.loginInputShow = false;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(this.auth, provider)
    await this.router.navigate(['/']);
  }

  async loginWithEmailAndPassword() {

    await signInWithEmailAndPassword(this.auth, this.email.value, this.password.value).then(
      res => {
        window.location.reload();
      },
      err => {
        this.gotError = true;

        if (err.code = 400){
          this.errorMessage = "Invalid email or password";
        }
      }
    );
  }

  async signupWithEmailAndPassword() {
    await createUserWithEmailAndPassword(this.auth, this.email.value, this.password.value).then(
      async res => {
        sendEmailVerification(res.user);

        await this.db.addUserProfile({
          username: this.username.value,
          id: res.user.uid,
          avatar_url: this.defaultAvatar,
          favorite_grams: [],
        }).then(() => {

        }).finally(() => {
          window.location.reload();
        });
      },
      err => {
        this.gotError = true;
        console.log(err.message);
        if (err.message == "Firebase: Error (auth/invalid-email)."){
          this.errorMessage = "Please enter valid email";
        } else if (err.message == "Firebase: Error (auth/email-already-in-use).") {
          this.errorMessage = "An account associated with this email already exists";
        }
      }
    );


  }
}
