import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  public messageError: string = ''

  constructor(
    private authService: AuthService
  ) { }

  signUpForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  passwordsMatch() {
    if (this.signUpForm.value.password === this.signUpForm.value.repeatPassword) {
      return true
    } else {
      return false
    }
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')!.value as string;
      const password = this.signUpForm.get('password')!.value as string;

      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email })
      ];

      if (this.passwordsMatch()) {
        this.authService.signUp(email, password, attributeList)
          .then(result => {
            console.log('Sign up success', result);
          })
          .catch(err => {
            const AuthErrors: any = [
              { "desc": "Password not long enough.", "message": "Password not long enough" },
              { "desc": "Password must have lowercase characters.", "message": "Password must have lowercase characters" },
              { "desc": "Password must have uppercase characters.", "message": "Password must have uppercase characters" },
              { "desc": "Password must have symbol characters.", "message": "Password must have symbol characters" },
              { "desc": "Password must have numeric characters", "message": "Password must have numeric characters" }
            ]

            if (err.code === 'UsernameExistsException') {
              this.messageError = 'An account with the given email already exists'
              // this.showSpinner = false;
            }

            this.messageError = AuthErrors.find((error: any) => err['code'].includes(error.code) || err['message'].includes(error.message)).desc
            console.error('Sign up error', err);
          });
      }
    }
  }
}
