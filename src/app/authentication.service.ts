import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TranslationService } from './translation.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  /* VARIABLES */

    // OBSERVABLES: isAuthenticated & userInfo & isInitialized (if service is available)
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticated.asObservable();

    private userInfo = new BehaviorSubject<any>(null);
    userInfo$ = this.userInfo.asObservable();
    
    private isInitialized = new BehaviorSubject<boolean>(false);
    public isInitialized$ = this.isInitialized.asObservable();

    // URLS BACKEND
    private apiURLSignIn = environment.apiBaseUrl + '/users/signin';
    private apiURLVerifyToken = environment.apiBaseUrl + '/users/verify-token';


  /* CONSTRUCTOR */
  constructor(private http: HttpClient, private translationService: TranslationService, @Inject(PLATFORM_ID) private platformId: Object) {
      if (this.isLocalStorageAvailable()) {
        this.verifyToken().subscribe({
          next: (data) => {
            this.setUserInfo(data);
            this.setIsAuthenticated(true);
            this.translationService.switchLanguage(data.preferredLanguage);
            this.isInitialized.next(true);  
          },
          error: (err) => {
            this.setIsAuthenticated(false);
            this.isInitialized.next(true);  
          }
        });
      } else {
        this.setIsAuthenticated(false);
        this.isInitialized.next(true);  
      }
  }
  

  /* METHODS */

    // USER: LOGIN, SET INFOS
    login(username: string, password: string): Observable<any> {
      const params = new HttpParams()
        .set('username', username)
        .set('password', password);
      return this.http.post(this.apiURLSignIn, null, { params });
    }

    setIsAuthenticated(isAuthenticated: boolean) {
      this.isAuthenticated.next(isAuthenticated);
    }

    getIsAuthenticated(): boolean {
      return this.isAuthenticated.value;
    }

    setUserInfo(user: any) {
      this.userInfo.next(user);
    }

    // TOKEN: CHECK, CREATE, DELETE
    verifyToken(): Observable<any> {
      if (this.isLocalStorageAvailable()) {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          return this.http.get(this.apiURLVerifyToken, { headers }).pipe(
            catchError(err => {
              this.setIsAuthenticated(false);
              return throwError(() => new Error('Token verification failed'));
            })
          );
        } else {
          return throwError(() => new Error('Token not found in localStorage'));
        }
      } else {
        return throwError(() => new Error('localStorage is not available'));
      }
    }

    storeToken(token: string) {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('jwtToken', token);
      }
    }

    getToken(): string | null {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem('jwtToken');
      }
      return null;
    }

    logout() {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem('jwtToken');
        this.setIsAuthenticated(false);
        this.setUserInfo(null);
      }
    }

    // HELPER METHOD: Check if localStorage is available
    private isLocalStorageAvailable(): boolean {
      return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
    }
}
