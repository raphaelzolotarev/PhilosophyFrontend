import { Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { User } from '../user';
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
  public popularPost: any = null;
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
    this.route.paramMap.subscribe(params => {
        this.postId = params.get('id'); 
        if (this.postId) {
            // Clear previous post data
            this.post = null;
            this.likes = [];
            this.comments = [];
            this.userLikedPost = false; // Reset userLikedPost to avoid showing the previous post's state

            // Fetch the post data
            this.postService.getPost(Number(this.postId)).subscribe({
                next: (post: Post) => {
                    this.post = post; 
                },
                error: (error) => {
                    this.router.navigate(['/blog']);
                }
            });

            // Fetch likes for the specific post
            this.likeService.getLikesByPostId(Number(this.postId)).subscribe({
                next: (response: Like[]) => {
                    this.likes = response;
                    // Check if the user has already liked the post after likes are fetched
                    if (this.isAuthenticated && this.user) {
                        this.userLikedPost = this.likes.some((like: Like) => like.user.id === this.user.id);
                    }
                },
                error: (err: any) => {
                    console.error('Error fetching likes:', err);
                }
            });

            // Fetch comments for the specific post
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

    // Handle authentication and user-related data
    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
        if (isInitialized) {
            this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
                this.isAuthenticated = isAuthenticated; 
            }); 
            this.authenticationService.userInfo$.subscribe(userInfo => {
                this.user = userInfo;
                // Recheck likes when user info is loaded
                if (this.likes) {
                    this.userLikedPost = this.likes.some((like: Like) => like.user.id === this.user.id);
                }
            });
            this.translationService.translations$.subscribe(translations => this.translations = translations);            
        }
    });

    // Fetch popular posts
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
