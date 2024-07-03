import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification-email',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './verification-email.component.html',
  styleUrl: './verification-email.component.scss'
})
export class VerificationEmailComponent {

  constructor(
    private authService: AuthService
  ) { }

  verifyForm = new FormGroup({
    email: new FormControl(''),
    code: new FormControl('')
  });

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const email = this.verifyForm.get('email')!.value as string;
      const code = this.verifyForm.get('code')!.value as string;

      this.authService.confirmSignUp(email, code)
        .then(result => {
          console.log('Verification success', result);
        })
        .catch(err => {
          console.error('Verification error', err);
        });
    }
  }
}
