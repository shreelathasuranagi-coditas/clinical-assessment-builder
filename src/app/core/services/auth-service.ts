import { inject, Injectable } from '@angular/core';
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
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
