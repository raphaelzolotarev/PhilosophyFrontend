import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Comment } from './comment';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class CommentService {
  
  private apiServerUrl = environment.apiBaseUrl;

  private isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitialized.asObservable();

  constructor(private http: HttpClient) { }

  //GET LIKES BY POST ID
  public getCommentsByPostId(postId : number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.apiServerUrl}/comments/post/${postId}`);
  }
  //GET LIKES BY USER ID
  public getCommentsByUserId(userId : number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.apiServerUrl}/comments/user/${userId}`);
  }

}
