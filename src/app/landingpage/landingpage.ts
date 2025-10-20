import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landingpage.html',
  styleUrls: ['./landingpage.css']
})
export class Landingpage {
  constructor(private router: Router) {}

  gotoSignup() {
    this.router.navigate(['/signup']);
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
