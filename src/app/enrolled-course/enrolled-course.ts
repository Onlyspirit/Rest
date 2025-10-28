import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-enrolled-course',
  templateUrl: './enrolled-course.html',
  styleUrls: ['./enrolled-course.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EnrolledCourse implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost/MOScholar'
      : 'https://backend-production-dec2.up.railway.app';

  course: any = null;
  isDarkMode: boolean = false;

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode);

    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId);
    } else {
      this.router.navigate(['./']);
    }
  }

  fetchCourseDetails(courseId: number) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.http.get(`${this.apiUrl}/get_course_details.php`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { courseId }
      }).subscribe({
        next: (response: any) => {
          this.course = response.course || null;
          if (!this.course) {
            this.router.navigate(['./']);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching course details:', err);
          alert(`Failed to fetch course details. Status: ${err.status}, Message: ${err.message}.`);
          this.router.navigate(['./']);
        }
      });
    } else {
      this.router.navigate(['./login']);
    }
  }

  enrollCourse() {
    const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;
    const token = localStorage.getItem('auth_token');
    if (userId && token) {
      this.http.post(`${this.apiUrl}/enroll.php`, { courseId: this.course.id, userId }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.router.navigate(['./']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Enrollment error:', err);
          alert(`Enrollment failed. Status: ${err.status}, Message: ${err.message}.`);
        }
      });
    } else {
      this.router.navigate(['./login']);
    }
  }
}