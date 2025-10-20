import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  constructor(private router: Router, public http: HttpClient) { }
  public builder = inject(FormBuilder)
  signuppage = this.builder.group({
    Firstname: ['', [Validators.required, Validators.minLength(3)]],
    Lastname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)]],
    role: ['', Validators.required]
  })
  role = document.getElementById('roles')
  roles = this.role

  test = false
  signup() {
    this.test = true
    if ((this.signuppage).valid) {
      console.log('peace be unto you');
      console.log(this.signuppage.value);
      this.http.post('http://localhost/MOScholar/signup.php', this.signuppage.value).subscribe(
        result => console.log(result)
      )

      setTimeout(() => {
          this.router.navigate(['./login'])

      }, 3000);

    }
  }


  signin() {
    this.router.navigate(['./login'])
  }
  onLogin(LoginForm: any) {

  }



}
