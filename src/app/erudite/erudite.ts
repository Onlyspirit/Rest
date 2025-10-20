import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-erudite',
  templateUrl: './erudite.html',
  styleUrls: ['./erudite.css'],
  imports: [CommonModule]
})
export class Erudite implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  progress: any[] = [];
  courses: any[] = [];
  completed: any[] = [];
  course: any[] = []
  item = JSON.parse(localStorage.getItem('response') || '{}');
  role = this.item.Role;
  firstname = this.item.Firstname;

  ngOnInit() {
    // Fetch all courses
    this.http.get<any[]>('http://localhost/MOScholar/get_courses.php').subscribe(
      // data => this.courses = data,
      err => console.error(err)
    );
  }
  sidebarOpen: boolean = false;
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  viewCourse() {

  }
  enroll(courseId: string) {
    // For now, alert. Later integrate payment
    alert(`Enrolled in course ${courseId}`);
    // After payment, send request to backend to register enrollment
  }
  enrollCourse() {
    alert('Enroll button clicked');
  }
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
