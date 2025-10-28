import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt?: Date;
  enrollmentCount?: number;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landingpage.html',
  styleUrls: ['./landingpage.css']
})
export class Landingpage implements OnInit {
  isDarkMode: boolean = false;
  showFilter: boolean = false;
  displayedCourses: Course[] = [];
  originalCourses: Course[] = [
    { id: 1, title: 'Introduction to Python', description: 'Learn Python basics', price: 5000, image: 'assets/python.jpg', createdAt: new Date('2025-01-01'), enrollmentCount: 150 },
    { id: 2, title: 'Web Development', description: 'Master HTML, CSS, JS', price: 7000, image: 'assets/webdev.jpg', createdAt: new Date('2024-06-01'), enrollmentCount: 200 },
    { id: 3, title: 'Data Science', description: 'Analyze data effectively', price: 6000, image: 'assets/datascience.jpg', createdAt: new Date('2025-03-01'), enrollmentCount: 100 }
  ];

  private apiUrl =
    window.location.hostname === 'localhost'
      ? 'http://localhost/MOScholar'
      : 'https://backend-production-dec2.up.railway.app';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

    // Initialize courses
    this.displayedCourses = [...this.originalCourses];
    // Optionally fetch courses from backend
    // this.fetchCourses();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.classList.toggle('dark-mode', this.isDarkMode);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  sortCourses(criteria: string) {
    this.showFilter = false;
    this.displayedCourses = [...this.displayedCourses].sort((a, b) => {
      switch (criteria) {
        case 'latest':
          return (b.createdAt ? new Date(b.createdAt).getTime() : b.id) - (a.createdAt ? new Date(a.createdAt).getTime() : a.id);
        case 'old':
          return (a.createdAt ? new Date(a.createdAt).getTime() : a.id) - (b.createdAt ? new Date(b.createdAt).getTime() : b.id);
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
  }

  fetchCourses() {
    this.http.get(`${this.apiUrl}/get_all_courses_unfiltered.php`).subscribe({
      next: (response: any) => {
        this.displayedCourses = response.courses || [];
        this.originalCourses = [...this.displayedCourses];
        console.log('Fetched courses:', this.displayedCourses);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching courses:', err);
        alert(`Failed to fetch courses. Status: ${err.status}, Message: ${err.message}.`);
        this.displayedCourses = [...this.originalCourses]; // Fallback to sample data
      }
    });
  }

  gotoSignup() {
    this.router.navigate(['/signup']);
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  viewCourseDetails(courseId: number) {
    alert(`Viewing details for course ${courseId}`);
  }

  onImageError(event: Event, course: Course) {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
    course.image = 'assets/placeholder.jpg';
  }
}