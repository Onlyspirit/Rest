import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-erudite',
  templateUrl: './erudite.html',
  styleUrls: ['./erudite.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class Erudite implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  constructor(private router: Router, private http: HttpClient) {}

  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost/MOScholar'
      : 'https://backend-production-dec2.up.railway.app';

  sidebarOpen = false;
  allCourses: any[] = [];
  originalCourses: any[] = [];
  enrolledCourses: any[] = [];
  user: any = {};
  role: string = 'Student';
  Lastname: string = '';
  showEnrolledModal = false;
  isDarkMode: boolean = false;
  showFilter: boolean = false;
  activeFilter: string = 'latest';
  searchQuery: string = '';

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

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
        this.router.navigate(['./login']);
      }
    } else {
      this.router.navigate(['./login']);
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.cdr.detectChanges();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode);
    this.cdr.detectChanges();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  sortCourses(sortType: string) {
    this.activeFilter = sortType;
    this.showFilter = false;
    this.allCourses = [...this.allCourses].sort((a, b) => {
      switch (sortType) {
        case 'latest':
          return (b.createdAt ? new Date(b.createdAt).getTime() : b.id) - (a.createdAt ? new Date(a.createdAt).getTime() : a.id);
        case 'old':
          return (a.createdAt ? new Date(a.createdAt).getTime() : a.id) - (b.createdAt ? new Date(b.createdAt).getTime() : a.id);
        case 'popular':
          return (b.enrollmentCount ?? b.id) - (a.enrollmentCount ?? a.id);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    this.cdr.detectChanges();
  }

  fetchAllCourses() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.http.get(`${this.apiUrl}/get_all_courses_unfiltered.php`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response: any) => {
          this.allCourses = response.courses || [];
          this.originalCourses = [...this.allCourses];
          this.sortCourses(this.activeFilter);
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching all courses:', err);
          alert(`Failed to fetch courses. Status: ${err.status}, Message: ${err.message}.`);
        }
      });
    } else {
      this.router.navigate(['./login']);
    }
  }

  searchCourses() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.allCourses = this.originalCourses.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    } else {
      this.allCourses = [...this.originalCourses];
    }
    this.sortCourses(this.activeFilter);
    this.cdr.detectChanges();
  }

  resetFilters() {
    this.searchQuery = '';
    this.activeFilter = 'latest';
    this.allCourses = [...this.originalCourses];
    this.sortCourses('latest');
    this.cdr.detectChanges();
  }

  fetchEnrolledCourses() {
    const userId = this.user.id;
    const token = localStorage.getItem('auth_token');
    if (userId && token) {
      this.http.get(`${this.apiUrl}/get_enrolled_courses.php`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId }
      }).subscribe({
        next: (response: any) => {
          // this.enrolledCourses = response.courses.map(course => ({
          //   ...course,
          //   progress: course.progress || 0
          // }));
          this.cdr.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching enrolled courses:', err);
          alert(`Failed to fetch enrolled courses. Status: ${err.status}, Message: ${err.message}.`);
        }
      });
    } else {
      alert('User ID or token not available. Please log in again.');
      this.router.navigate(['./login']);
    }
  }

  enrollCourse(courseId: number) {
    const userId = this.user.id;
    const token = localStorage.getItem('auth_token');
    if (userId && token) {
      this.http.post(`${this.apiUrl}/enroll.php`, { courseId, userId }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }).subscribe({
        next: (response: any) => {
          alert(response.message);
          this.fetchEnrolledCourses();
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

  onImageError(event: Event, course: any) {
    const img = event.target as HTMLImageElement;
    console.error(`Image failed to load for course ${course.id}:`, course.image);
    img.src = 'assets/placeholder.jpg';
    course.originalImage = course.image || img.src;
  }

  toggleEnrolledModal() {
    this.showEnrolledModal = !this.showEnrolledModal;
    this.cdr.detectChanges();
  }

  coursePage() {
    this.router.navigate(['./enrolled']);
  }

  logout() {
    localStorage.removeItem('user_data');
    localStorage.removeItem('theme');
    this.router.navigate(['./login']);
  }
}