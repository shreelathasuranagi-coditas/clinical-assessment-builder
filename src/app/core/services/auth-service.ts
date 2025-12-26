import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MockUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.mockDbUrl;

  readonly currentUser = signal<Partial<MockUser> | null>(null);

  constructor(private http: HttpClient) {}


  hydrateUser(): void {
    if (this.currentUser()) return;

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
    return this.http.get<MockUser[]>(`${this.baseUrl}/users`).pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('role', user.role);
        localStorage.setItem('isLoggedIn', 'true');

        this.currentUser.set({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });

        return user;
      })
    );
  }


  logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
  }


  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
