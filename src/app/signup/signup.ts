import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'] // ✅ corrected (was `styleUrl`)
})
export class Signup {
  constructor(private router: Router, public http: HttpClient) {}

  public builder = inject(FormBuilder);

  // 🧠 Automatically choose between local and live backend
  private baseUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost/MOScholar'
      : 'https://backend-production-dec2.up.railway.app';

  signuppage = this.builder.group({
    Firstname: ['', [Validators.required, Validators.minLength(3)]],
    Lastname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      ]
    ],
    role: ['', Validators.required]
  });

  test = false;

  signup() {
    this.test = true;
    if (this.signuppage.valid) {
      console.log('Submitting signup data:', this.signuppage.value);

      // 👇 automatically sends to either localhost or Railway
      this.http
        .post(`${this.baseUrl}/signup.php`, this.signuppage.value)
        .subscribe(
          (result: any) => {
            console.log('Signup result:', result);
            alert(result.message || 'Signup successful!');
            setTimeout(() => {
              this.router.navigate(['./login']);
            }, 2000);
          },
          (error) => {
            console.error('Signup error:', error);
            alert('Something went wrong. Please try again.');
          }
        );
    } else {
      alert('Please fill all fields correctly before submitting.');
    }
  }

  signin() {
    this.router.navigate(['./login']);
  }
}
