import { Component, OnInit, Optional } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification } from '@angular/fire/auth';
import { EmailAuthProvider, signInWithEmailAndPassword, signInWithRedirect } from '@firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(@Optional() private auth: Auth, private router: Router) { }

  loginInputShow: boolean = true;
  signupInputShow: boolean = false;
  gotError: boolean = false;

  errorMessage: string = "";

  email = new FormControl('', [Validators.required, Validators.email]);
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
    await signInWithRedirect(this.auth, provider);
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
      res => {
        sendEmailVerification(res.user);
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
}
