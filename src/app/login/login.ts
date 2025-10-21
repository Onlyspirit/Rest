import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id: string;
  Role: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  token: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  constructor(private router: Router, public http: HttpClient) {}

  public builder = inject(FormBuilder);

  // 🧠 Automatically switch between local and live base URLs
  private baseUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost/MOScholar'
      : 'https://backend-production-dec2.up.railway.app';

  signinpage = this.builder.group({
    Email: ['', [Validators.required, Validators.email]],
    Password: [
      '',
      [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      ]
    ]
  });

  onLogin() {
    if (this.signinpage.valid) {
      this.http
        .post<{
          status: string;
          message?: string;
          Firstname?: string;
          user?: User;
          redirect?: string;
        }>(`${this.baseUrl}/login.php`, this.signinpage.value)
        .subscribe(
          (response) => {
            if (response.status === 'success' && response.user) {
              const user = response.user;
              localStorage.setItem('user_data', JSON.stringify(user));
              localStorage.setItem('auth_token', user.token);
              if (response.redirect) {
                this.router.navigate([response.redirect], { replaceUrl: true });
              } else if (user.Role?.toLowerCase() === 'erudite') {
                this.router.navigate(['/student'], { replaceUrl: true });
              } else if (user.Role?.toLowerCase() === 'instructor') {
                this.router.navigate(['/instructor'], { replaceUrl: true });
              } else {
                alert('Unknown role, cannot navigate.');
                this.router.navigate(['/login'], { replaceUrl: true });
              }
            } else {
              alert(response.message || 'Login failed');
            }
          },
          (error) => {
            console.error(error);
            alert('Something went wrong');
          }
        );
    }
  }

  signup() {
    this.router.navigate(['/signup']);
  }
}
