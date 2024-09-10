import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { PostService } from '../post.service';
import { Post } from '../post';
import { LikeService } from '../like.service';
import { Like } from '../like';
import { CommentService } from '../comment.service';
import { Comment } from '../comment';

@Component({
  selector: 'app-postdetails',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './postdetails.component.html',
  styleUrl: './postdetails.component.scss'
})

export class PostdetailsComponent {

  public post: any = null;
  public popularPost: Post[] | null = null;
  public likes: any = null;
  public comments: any = null;
  public user: any = null;
  public postId: string | null = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;
  public userLikedPost : boolean = false;

  constructor(private likeService : LikeService, private commentService : CommentService, private authenticationService : AuthenticationService, private postService: PostService, private translationService: TranslationService, private route: ActivatedRoute, private router: Router) {
    
    this.postService.getRecentPosts().subscribe(posts => {this.popularPost = posts;});
  }

  ngOnInit() {
    //recent posts
    this.postService.getRecentPosts().subscribe({
      next: (posts) => {
        this.popularPost = posts; 
      },
      error: (err) => {
        console.error('Error fetching popular posts:', err);
        this.popularPost = []; 
      }
    });

    this.route.paramMap.subscribe(params => {
        this.postId = params.get('id'); 
        if (this.postId) {

            this.post = null;
            this.likes = [];
            this.comments = [];
            this.userLikedPost = false;

            this.postService.getPost(Number(this.postId)).subscribe({
                next: (post: Post) => {
                    this.post = post;                     
                },
                error: (error) => {
                    this.router.navigate(['/blog']);
                }
            });            

            this.likeService.getLikesByPostId(Number(this.postId)).subscribe({
                next: (response: Like[]) => {
                    this.likes = response;
                    if (this.isAuthenticated && this.user) {
                        this.userLikedPost = this.likes.some((like: Like) => like.user.id === this.user.id);
                    }
                },
                error: (err: any) => {
                    console.error('Error fetching likes:', err);
                }
            });
            
            this.commentService.getCommentsByPostId(Number(this.postId)).subscribe({
                next: (response: Comment[]) => {
                    this.comments = response;
                },
                error: (err: any) => {
                    console.error('Error fetching comments:', err);
                }
            });
            
        }
    });

    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
        if (isInitialized) {
            this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
                this.isAuthenticated = isAuthenticated; 
            }); 
            this.authenticationService.userInfo$.subscribe(userInfo => {
                this.user = userInfo;
                if (this.likes) {
                    this.userLikedPost = this.likes.some((like: Like) => like.user.id === this.user.id);
                }
            });
            this.translationService.translations$.subscribe(translations => this.translations = translations);    
                    
        }
    });

}

  //LIKE POST
  like(postId: number, userId: number): void {
    this.postService.likePost(postId, userId).subscribe({
      next: () => {
        this.userLikedPost = true;    
        window.location.reload();
      },
      error: (error) => {
        console.error('Error liking post', error);  
        window.location.reload();
      }
    });
  }

  //DISLIKE POST
  dislike(postId: number, userId: number): void {
    this.postService.dislikePost(postId, userId).subscribe({
      next: () => {
        this.userLikedPost = false;
        window.location.reload();
      },
      error: (error) => {
        console.error('Error disliking post', error);  
        window.location.reload();
      }
    });
  }

  //DELETE POST
  delete(postId: number): void {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.router.navigate(['/blog']);
      },
      error: (error) => {
        console.error('Error deleting post', error);  
        //this.router.navigate(['/blog']);
      }
    });
  }


  //COMMENT POST
  comment(postId: number, userId: number, text: string): void {
    this.postService.comentPost(postId, userId, text).subscribe({
      next: () => {
        this.userLikedPost = true;    
        window.location.reload();
      },
      error: (error) => {
        console.error('Error commenting post', error); 
        window.location.reload();
      }
    });
  }

  //UNCOMMENT POST
  uncomment(commentId: number): void {
    this.postService.uncommentPost(commentId).subscribe({
      next: () => {
        this.userLikedPost = false;
        window.location.reload();
      },
      error: (error) => {
        console.error('Error uncommenting post', error);  
        window.location.reload();
      }
    });
  }

}