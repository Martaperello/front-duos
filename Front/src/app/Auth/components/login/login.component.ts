import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isRightPanelActive: boolean;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private localstorage: LocalStorageService
  ) {
    this.isRightPanelActive = false;
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!*&])(?!\s).*$/),
        ],
      ],
    });

    this.registerForm = this.fb.group(
      {
        register_name: ['', Validators.required],
        register_email: ['', [Validators.required, Validators.email]],
        register_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[@$!*&])(?!\s).*$/),
          ],
        ],
        password_confirm: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  onSignUpClick(): void {
    // console.log('Upclick');
    this.isRightPanelActive = true;
  }

  onSignInClick(): void {
    // console.log('Inclick');
    this.isRightPanelActive = false;
  }

  handleLoginUser(): void {
    if (!this.loginForm.valid) {
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe((userData) => {
      this.localstorage.set('userId', userData.data.data._id);
      this.router.navigate(['/']);
    });
    this.loginForm.reset();
  }

  handleRegisterUser(): void {
    console.log('entrere');
    if (!this.registerForm.valid) {
      console.log('entre');
      
      return;
    }

    const name = this.registerForm.value.register_name;
    const email = this.registerForm.value.register_email;
    const password = this.registerForm.value.register_password;
    const confirmPassword = this.registerForm.value.password_confirm;

    this.authService
      .register(name, email, password, confirmPassword)
      .subscribe((userData) => {
        console.log('data', userData);
        this.localstorage.set('userId', userData.data.data._id);
        this.router.navigate(['/']);
      });

    this.registerForm.reset();
  }

  // Password Validator
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('register_password')?.value;
    const confirmPassword = formGroup.get('password_confirm')?.value;
    console.log(password === confirmPassword);
    
    return password === confirmPassword ? null : { mismatch: true };
  }
}
