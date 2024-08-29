import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiServerUrl}/users/show`);
  }
  public searchUsers(keyword: String): Observable<User[]>{
      if (!keyword || keyword.trim() === "") return this.getUsers();
      return this.http.get<User[]>(`${this.apiServerUrl}/users/search/${keyword}`);
  }
  public addUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiServerUrl}/users/add`, user);
  }
  public updateUser(user: User): Observable<User>{
    return this.http.put<User>(`${this.apiServerUrl}/users/update`, user);
  }
  public deleteeUser(userID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/users/delete/${userID}`);
  }


    //check if user is connected
    public getUserInfo(): Observable<User> {
      return this.http.get<User>(`${this.apiServerUrl}/users/auth`, { withCredentials: true });
    }  
    public isAuthenticated(): Observable<boolean> {
      return this.http.get<boolean>(`${this.apiServerUrl}/users/auth`, { withCredentials: true });
    }

}
