import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = this.getToken();
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!token);
    
    if (token && !this.getUserData()) {
      this.fetchUserData().subscribe();
    }
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserData(response.user);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/verify`, { token });
  }

  resendVerification(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/resend-verification`, {});
  }

  logout(): void {
    this.clearAuthData();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getUserData(): any {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      if (!userData) return null;
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  private setUserData(user: any): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  private fetchUserData(): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/me`).pipe(
      tap(user => {
        this.setUserData(user);
      })
    );
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      return true;
    } catch {
      this.clearAuthData();
      return false;
    }
  }
} 