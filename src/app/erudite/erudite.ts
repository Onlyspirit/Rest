import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-erudite',
  templateUrl: './erudite.html',
  styleUrls: ['./erudite.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Erudite implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private apiUrl = 'http://localhost/MOScholar';

  sidebarOpen = false;
  allCourses: any[] = [];
  enrolledCourses: any[] = [];
  user: any = {};
  role: string = 'Student';
  Lastname: string = '';
  showEnrolledModal = false;

  ngOnInit() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        this.role = this.user.Role || 'Student';
        this.Lastname = this.user.Lastname || 'Student';
        this.fetchAllCourses();
        this.fetchEnrolledCourses();
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user_data');
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  fetchAllCourses() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.http.get(`${this.apiUrl}/get_all_courses_unfiltered.php`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        (response: any) => {
          this.allCourses = response.courses || [];
          console.log('Fetched all courses:', this.allCourses);
          this.cdr.detectChanges();
        },
        (err: HttpErrorResponse) => {
          console.error('Error fetching all courses:', err);
          alert(`Failed to fetch courses. Status: ${err.status}, Message: ${err.message}.`);
        }
      );
    }
  }

  fetchEnrolledCourses() {
    const userId = this.user.id;
    const token = localStorage.getItem('auth_token');
    if (userId && token) {
      this.http.get(`${this.apiUrl}/get_enrolled_courses.php`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId }
      }).subscribe(
        (response: any) => {
          this.enrolledCourses = response.courses || [];
          console.log('Fetched enrolled courses:', this.enrolledCourses);
          this.cdr.detectChanges();
        },
        (err: HttpErrorResponse) => {
          console.error('Error fetching enrolled courses:', err);
          alert(`Failed to fetch enrolled courses. Status: ${err.status}, Message: ${err.message}.`);
        }
      );
    } else {
      alert('User ID or token not available. Please log in again.');
    }
  }

  enrollCourse(courseId: number) {
    const userId = this.user.id;
    const token = localStorage.getItem('auth_token');
    if (userId && token) {
      this.http.post(`${this.apiUrl}/enroll.php`, { courseId, userId }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }).subscribe(
        (response: any) => {
          alert(response.message);
          this.fetchEnrolledCourses(); // Re-fetch to update with current user's enrollments
        },
        (err: HttpErrorResponse) => {
          console.error('Enrollment error:', err);
          alert(`Enrollment failed. Status: ${err.status}, Message: ${err.message}.`);
        }
      );
    }
  }

  viewCourseDetails(courseId: number) {
    alert(`Viewing details for course ${courseId}`);
  }

  onImageError(event: Event, course: any) {
    const img = event.target as HTMLImageElement;
    console.error(`Image failed to load for course ${course.id}:`, course.image, 'Original data:', course.originalImage);
    img.src = 'assets/placeholder.jpg';
    if (!course.originalImage) {
      course.originalImage = course.image;
    }
  }

  toggleEnrolledModal() {
    this.showEnrolledModal = !this.showEnrolledModal;
  }

  logout() {
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  }
}