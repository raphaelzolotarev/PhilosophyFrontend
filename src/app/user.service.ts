import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { User } from './user';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  private apiServerUrl = environment.apiBaseUrl;
  private isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitialized.asObservable();

  constructor(private http: HttpClient) { }

  //CHANGE LANGUAGE
  public updateUserLang(username: string, lang: string): Observable<User> {
    const params = new HttpParams()
    .set('username', username)
    .set('lang', lang);
    return this.http.post<User>(this.apiServerUrl+'/users/changelang', null, { params }); 
  }

  //ADD USER
  public addUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiServerUrl}/users/add`, user);
  }

  //UPDATE USER
  public updateUser(user: User): Observable<User>{
    return this.http.put<User>(`${this.apiServerUrl}/users/update`, user);
  }

  //GET ALL USERS
  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiServerUrl}/users/show`);
  }

  //GET ONE USER
  public getUser(userId: number): Observable<User>{
    return this.http.get<User>(`${this.apiServerUrl}/users/find/${userId}`);
  }

  // FOLLOW USER
  public followUser(userId: number, targetUserId: number): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/users/${userId}/follow/${targetUserId}`, {});
  }
  public unFollowUser(userId: number, targetUserId: number): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/users/${userId}/unfollow/${targetUserId}`, {});
  }
  public getFollowers(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/users/followers/${userId}`, {});
  }
  public getFollowing(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/users/following/${userId}`, {});
  }  

  //SEARCH
  public searchUsers(keyword: String): Observable<User[]>{
      if (!keyword || keyword.trim() === "") return this.getUsers();
      return this.http.get<User[]>(`${this.apiServerUrl}/users/search/${keyword}`);
  }

  //DELETE
  public deleteUser(userID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/users/delete/${userID}`);
  }

}