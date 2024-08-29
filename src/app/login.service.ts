import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiURL = 'http://localhost:8080/users/signin';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(this.apiURL, null, { params });
  }

  storeToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
  logout() {
    localStorage.removeItem('jwtToken');
  }
}