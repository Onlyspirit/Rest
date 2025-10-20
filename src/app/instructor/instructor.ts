import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  // standalone: true,
  selector: 'app-instructor',
  imports: [CommonModule],
  templateUrl: './instructor.html',
  styleUrls: ['./instructor.css']
})
export class Instructor implements OnInit {
  sidebarOpen = false;
  courses: any[] = [];
  item = JSON.parse(localStorage.getItem('response') || '{}');
  role = this.item.Role;
  firstname = this.item.Firstname;

  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit() {
    if (!this.item || !this.item.Role) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchCourses();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  fetchCourses() {
    this.courses = [
      { id: 1, title: 'Angular 101', description: 'Learn Angular basics', price: 0, image: 'https://via.placeholder.com/220x140' },
      { id: 2, title: 'React 101', description: 'Learn React basics', price: 1000, image: 'https://via.placeholder.com/220x140' }
    ];
  }

  enroll(courseId: number) {
    alert(`Enrolled in course ${courseId}`);
  }

  createCourse() {
    this.router.navigate(['/create-course']);
  }

  logout() {
    localStorage.removeItem('response');
    this.router.navigate(['/login']);
  }
}
