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
  constructor(private router: Router, public http: HttpClient) { }
  public builder = inject(FormBuilder)
  signinpage = this.builder.group(
    {
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.minLength(8), Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]]
    }
  )



  onLogin() {
    if (this.signinpage.valid) {
      this.http.post<{ status: string; message?: string; Firstname?: string; user?: User }>(
        'http://localhost/MOScholar/login.php',
        this.signinpage.value
      ).subscribe(
        (response) => {
          if (response.status === 'success' && response.user) {
            const user = response.user;
            // console.log(`Welcome ${response.Firstname}!`);

            // Store token and user data
            localStorage.setItem('auth_token', user.token);
            localStorage.setItem('user_data', JSON.stringify(user));

            // Navigate based on role
            const role = user.Role?.toLowerCase();
            if (role === 'erudite') {
              this.router.navigate(['./student'], { replaceUrl: true });
            } else if (role === 'instructor') {
              this.router.navigate(['./instructor'], { replaceUrl: true });
            } else {
              // Optional: handle unknown role
              alert('Unknown role, cannot navigate.');
              this.router.navigate(['./login'], { replaceUrl: true });
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
