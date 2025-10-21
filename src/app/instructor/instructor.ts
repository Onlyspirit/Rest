import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.html',
  styleUrls: ['./instructor.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Instructor implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  private apiUrl = 'http://localhost/MOScholar';

  sidebarOpen = false;
  courses: any[] = [];
  user: any = {};
  role: string = 'Instructor';
  Lastname: string = '';
  showCreateModal = false;
  courseForm!: FormGroup;

  ngOnInit() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        this.role = this.user.Role || 'Instructor';
        this.Lastname = this.user.Lastname || 'Instructor';
        this.fetchCourses();
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user_data');
      }
    }
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      imageFile: [null] // Will store base64 or null
    });
  }

 fetchCourses() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    this.http.get(`${this.apiUrl}/get_all_courses.php`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response: any) => {
        this.courses = response.courses || [];
        console.log('Fetched courses:', this.courses);
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching courses:', err);
        alert(`Failed to fetch courses. Status: ${err.status}, Message: ${err.message}.`);
      }
    );
  } else {
    alert('Authentication token not available. Please log in again.');
  }
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.courseForm.reset({ price: 0 }); // Reset with default price
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        this.courseForm.patchValue({ imageFile: null });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Image size exceeds 2MB. Please upload a smaller file.');
        this.courseForm.patchValue({ imageFile: null });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.courseForm.patchValue({ imageFile: e.target?.result as string }); // Store as base64
      };
      reader.onerror = () => {
        alert('Error reading image file.');
        this.courseForm.patchValue({ imageFile: null });
      };
      reader.readAsDataURL(file);
    }
  }

  createCourse() {
    if (this.courseForm.valid) {
      const { title, description, price, imageFile } = this.courseForm.value;
      const userId = this.user.id;
      const token = localStorage.getItem('auth_token');
      if (userId && token) {
        this.http.post(`${this.apiUrl}/create_course.php`, { title, description, price, image: imageFile, userId }, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe(
          (response: any) => {
            if (response.id) {
              alert(`Course ${title} created with ID ${response.id}`);
              this.courses.push({ id: response.id, title, description, price, image: imageFile });
              this.closeCreateModal();
            } else {
              alert('Course created, but no ID returned. Check server logs.');
            }
          },
          (err: HttpErrorResponse) => {
            console.error('Course creation error:', err.status, err.statusText, err.error);
            alert(`Failed to create course. Status: ${err.status}, Message: ${err.error?.message || err.message}. Check console for details.`);
          }
        );
      } else {
        alert('User ID or token not available. Please log in again.');
      }
    } else {
      alert('Please fill out the form correctly. Check for required fields or invalid values.');
    }
  }

  editCourse(courseId: number) {
    alert(`Editing course ${courseId}`);
    // Add edit logic later if needed
  }

  uploadVideo(courseId: string) {
    alert(`Uploading video for course ${courseId}`);
    // Add video upload logic later if needed
  }

  logout() {
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  }
}