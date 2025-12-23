import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

interface MockUser {
  id: number;
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userUrl = environment.mockUsersUrl;
  private http = inject(HttpClient);

  login(username: string, password: string) {
  return this.http.get<MockUser[]>(this.userUrl).pipe(
    map(users => {
      const user = users.find(
        u => u.username === username && u.password === password
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('role', user.role);
      localStorage.setItem('isLoggedIn', 'true');

      return {
        id: user.id,
        username: user.username,
        role: user.role
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
