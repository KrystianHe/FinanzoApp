import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private autoLoginAttempted = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('AuthService initialized with API_URL:', this.API_URL);
    // Nie wywołujemy checkLoginStatus przy inicjalizacji, aby zapobiec automatycznemu przekierowaniu
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{token: string, user: User}>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserData(response.user);
        this.isLoggedInSubject.next(true);
        this.autoLoginAttempted = true;
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

  logoutWithoutRedirect(): void {
    this.clearAuthData();
    this.isLoggedInSubject.next(false);
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

  private setUserData(user: User): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedInSubject.next(true);
    } else {
      // Tylko czyszczenie danych bez przekierowania
      this.logoutWithoutRedirect();
    }
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isLoggedInSubject.next(true);
    } else if (!this.autoLoginAttempted) {
      // Używamy wersji bez przekierowania
      this.logoutWithoutRedirect();
    }
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/change-password`, { currentPassword, newPassword });
  }

  deactivateAccount(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/deactivate-account`, {});
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.API_URL}/auth/delete-account`);
  }
} 