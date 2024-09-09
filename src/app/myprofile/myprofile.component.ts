import { Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { LikeService } from '../like.service';
import { Like } from '../like';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.scss'
})

export class MyprofileComponent {

  public userInfo: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;
  
  public followers: User[] = [];
  public following: User[] = [];
  public likes : Like[] = [];
  public posts : Post[] = [];

  public showFollowing = true;

  constructor(private userService : UserService, private postService : PostService, private likeService : LikeService, private renderer: Renderer2, private el: ElementRef, private translationService: TranslationService, private authenticationService : AuthenticationService, private router: Router) {  }

  //IF NOT LOGGED REDIRECT
    ngOnInit() {
      this.authenticationService.isInitialized$.subscribe((isInitialized) => {
        if (isInitialized) {
          this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;            
            if (!isAuthenticated) {
              this.router.navigate(['/']);
            }
          });  

          this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
          this.translationService.translations$.subscribe(translations => this.translations = translations);
               
          this.userService.getFollowers(this.userInfo.id).subscribe({
            next: (followers: User[]) => {
              this.followers = followers;
              console.log('Followers:', this.followers);
            },
            error: (error) => {
              console.error('Error fetching followers:', error);
            }
          });
        
          // Fetch following
          this.userService.getFollowing(this.userInfo.id).subscribe({
            next: (following: User[]) => {
              this.following = following; 
              console.log('Following:', this.following);
            },
            error: (error) => {
              console.error('Error fetching following:', error);
            }
          });

          this.likeService.getLikesByUserId(Number(this.userInfo.id)).subscribe({
            next: (response: Like[]) => {
              this.likes = response;
            },
            error: (err: any) => {
              console.error('Error fetching likes:', err);
            }
          });

          this.postService.getPostsByUserId(this.userInfo.id).subscribe({
            next: (response: Post[]) => {
              this.posts = response;
            },
            error: (err: any) => {
              console.error('Error fetching posts:', err);
            }
          });

        }
      });
    }


    //tab navigation
    onNavLinkClick(event: MouseEvent, targetId: string) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      const navLinks = this.el.nativeElement.querySelectorAll('.nav-link');
      navLinks.forEach((link: HTMLElement) => {
        this.renderer.removeClass(link, 'active');
      });
      const clickedElement = event.target as HTMLElement;
      this.renderer.addClass(clickedElement.closest('.nav-link'), 'active');
    }

    
    //button show followers, following
    toggleFollowing(): void {
      const linkFollowing = document.getElementById('linkfollowing') as HTMLElement;
      const linkFollower = document.getElementById('linkfollower') as HTMLElement;
      linkFollowing.classList.add('afltr-active');
      linkFollower.classList.remove('afltr-active');
      this.showFollowing = true;
    }

    toggleFollower(): void {
      const linkFollowing = document.getElementById('linkfollowing') as HTMLElement;
      const linkFollower = document.getElementById('linkfollower') as HTMLElement;
      linkFollower.classList.add('afltr-active');
      linkFollowing.classList.remove('afltr-active');
      this.showFollowing = false;
    }


    //follow/unfollow    
    unFollowUser(targetUserId: number): void {
      const currentUserId = this.userInfo.id;
      this.userService.unFollowUser(currentUserId, targetUserId).subscribe({
        next: (response) => {
          this.authenticationService.setUserInfo(response);   
          window.location.reload();
        },
        error: (error) => {
          console.error('Error unfollowing user', error);
          window.location.reload();
        }
      });
    }
    isUserFollowed(userId: number): boolean {
      return this.userInfo?.following?.some((user: any) => user.id === userId);
    }
    followUser(targetUserId: number): void {
      const currentUserId = this.userInfo.id;
      this.userService.followUser(currentUserId, targetUserId).subscribe({
        next: (response) => {
          this.authenticationService.setUserInfo(response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error following user', error);    
          window.location.reload();
        }
      });
    }

      //DISLIKE POST
      dislike(postId: number, userId: number): void {
        this.postService.dislikePost(postId, userId).subscribe({
          next: () => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Error liking post', error);  
            window.location.reload();
          }
        });
      }

    
}
