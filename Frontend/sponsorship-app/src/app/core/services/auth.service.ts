import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  token?: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  message: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  //private apiUrl = 'https://localhost:5001/api';
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            fullName: response.fullName,
            email: response.email,
            role: response.role,
            department: response.department
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userId', user.id.toString());

          this.currentUserSubject.next(user);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  getCurrentUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : 0;
  }

  setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id.toString());
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
  }
}
