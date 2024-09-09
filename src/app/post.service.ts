import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Post } from './post';
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class PostService {
  
  private apiServerUrl = environment.apiBaseUrl;

  private isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitialized.asObservable();

  constructor(private http: HttpClient) { }

  //ADD POST
  public addPost(post: Post): Observable<Post>{
    return this.http.post<Post>(`${this.apiServerUrl}/posts/add`, post);
  }

  //UPDATE POST
  public updatePost(post: Post): Observable<Post>{
    return this.http.put<Post>(`${this.apiServerUrl}/posts/update`, post);
  }

  //GET ALL POST
  public getPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.apiServerUrl}/posts/show`);
  }
  //GET ALL RECENT POST
  public getRecentPosts(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.apiServerUrl}/posts/showrecent`);
  }

  //GET POSTS BY USER ID
  public getPostsByUserId(userId : number): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.apiServerUrl}/posts/${userId}`);
  }

  //GET ONE POST
  public getPost(postID: number): Observable<Post>{
    return this.http.get<Post>(`${this.apiServerUrl}/posts/find/${postID}`);
  }

  //DELETE POST
  public deletePost(postID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/posts/delete/${postID}`);
  }


  
  //LIKE
  public likePost(postID: number, userID: number): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/posts/like/${postID}`, null, { params: { userId: userID.toString() }});
  }
  //DISLIKE
  public dislikePost(postID: number, userID: number): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/posts/dislike/${postID}`, null, { params: { userId: userID.toString() }});
  }

  
  //COMMENT
  public comentPost(postID: number, userID: number, text: string): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/posts/comment/${postID}`, null, { params: {userId: userID.toString(), text: text} });
  }
  //UNCOMMENT
  public uncommentPost(commentId: number): Observable<void>{
    return this.http.post<void>(`${this.apiServerUrl}/posts/uncomment/${commentId}`, {});
  }


  //SEARCH BAR
  public searchPosts(keyword: String): Observable<Post[]>{
    if (!keyword || keyword.trim() === "") return this.getPosts();
    return this.http.get<Post[]>(`${this.apiServerUrl}/posts/search/${keyword}`);
  }
  public searchPostsByTag(keyword: String): Observable<Post[]>{
    if (!keyword || keyword.trim() === "") return this.getPosts();
    return this.http.get<Post[]>(`${this.apiServerUrl}/posts/searchtag/${keyword}`);
  }



}
