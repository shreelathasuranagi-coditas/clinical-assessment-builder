import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MockUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = environment.mockDbUrl;
  
  currentUser = signal<Partial<MockUser> | null>(null);

  constructor() {
    // Initialize currentUser from localStorage on app startup
    this.initializeUser();
  }

  private initializeUser(): void {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (userId && userName && userEmail && role) {
      this.currentUser.set({
        id: Number(userId),
        name: userName,
        email: userEmail,
        role: role as 'ADMIN' | 'CLINICIAN',
      });
    }
  }

  login(email: string, password: string) {
  return this.http
    .get<MockUser[]>(`${this.baseUrl}/users`)
    .pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('role', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);

        this.currentUser.set(user);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      })
    );
}

  logout() {
    this.currentUser.set(null);
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getCurrentUser(): Partial<MockUser> | null {
    if (this.currentUser()) {
      return this.currentUser();
    }

    // Reconstruct from localStorage if needed (e.g., on page refresh)
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (userId && userName && userEmail && role) {
      const user: Partial<MockUser> = {
        id: Number(userId),
        name: userName,
        email: userEmail,
        role: role as 'ADMIN' | 'CLINICIAN',
      };
      this.currentUser.set(user);
      return user;
    }

    return null;
  }
}
