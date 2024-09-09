import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Like } from './like';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class LikeService {
  
  private apiServerUrl = environment.apiBaseUrl;
  private isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitialized.asObservable();
  constructor(private http: HttpClient) { }

  //GET LIKES BY POST ID
  public getLikesByPostId(postId : number): Observable<Like[]>{
    return this.http.get<Like[]>(`${this.apiServerUrl}/likes/post/${postId}`);
  }
  //GET LIKES BY USER ID
  public getLikesByUserId(userId : number): Observable<Like[]>{
    return this.http.get<Like[]>(`${this.apiServerUrl}/likes/user/${userId}`);
  }

}
