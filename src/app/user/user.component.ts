import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  public messageError: string = ''
  isLinear = true
  isStepOneCompleted: boolean = false
  isStepTwoCompleted: boolean = false
  isStepThreeCompleted: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  signUpForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });

  verifyForm = new FormGroup({
    email: new FormControl(''),
    code: new FormControl('')
  });

  passwordsMatch() {
    if (this.signUpForm.value.password === this.signUpForm.value.repeatPassword) {
      return true
    } else {
      return false
    }
  }

  onSubmitSignup(stepper: MatStepper): void {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.get('email')!.value as string;
      const password = this.signUpForm.get('password')!.value as string;

      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email })
      ];

      if (this.passwordsMatch()) {
        this.authService.signUp(email, password, attributeList)
          .then((result: any) => {
            console.log('Sign up success', result);
            this.isStepOneCompleted = true;
            stepper.next()
          })
          .catch((err: any) => {
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

  onSubmitVerify(stepper: MatStepper): void {
    if (this.verifyForm.valid) {
      const email = this.verifyForm.get('email')!.value as string;
      const code = this.verifyForm.get('code')!.value as string;

      this.authService.confirmSignUp(email, code)
        .then((result: any) => {
          console.log('Verification success', result);
          this.isStepTwoCompleted = true;
          stepper.next()
        })
        .catch((err: any) => {
          console.error('Verification error', err);
        });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
