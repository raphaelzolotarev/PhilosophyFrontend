import { Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
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

import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.scss'
})
export class UserprofileComponent {

  
  public userId: string | null = null;
  public profileInfo: any = null;
  public userInfo: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;
  
  public followers: User[] = [];
  public following: User[] = [];
  public likes : Like[] = [];
  public posts : Post[] = [];

  public showFollowing = true;


constructor(private route: ActivatedRoute, private userService : UserService, private postService : PostService, private likeService : LikeService, private renderer: Renderer2, private el: ElementRef, private translationService: TranslationService, private authenticationService : AuthenticationService, private router: Router) {
  


  }

/*
//IF NOT LOGGED REDIRECT
  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');         

      this.userService.getUser(Number(this.userId)).subscribe({
        next: (user: User) => {
          this.profileInfo = user;
          
          if(this.userInfo.id == this.profileInfo.id){
            window.location.href = '/myprofile';
          }

          this.userService.getFollowers(this.profileInfo.id).subscribe({
            next: (followers: User[]) => {
              this.followers = followers;
              console.log('Followers:', this.followers);
            },
            error: (error) => {
              console.error('Error fetching followers:', error);
            }
          });
        
          // Fetch following
          this.userService.getFollowing(this.profileInfo.id).subscribe({
            next: (following: User[]) => {
              this.following = following; 
              console.log('Following:', this.following);
            },
            error: (error) => {
              console.error('Error fetching following:', error);
            }
          });
  


        },
        error: (error) => {
          this.router.navigate(['/']);
        }
      });

    });
    

    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated; 
          this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
          this.translationService.translations$.subscribe(translations => this.translations = translations);
        
                
        });  
                     

        this.likeService.getLikesByUserId(Number(this.profileInfo.id)).subscribe({
          next: (response: Like[]) => {
            this.likes = response;
          },
          error: (err: any) => {
            console.error('Error fetching likes:', err);
          }
        });

        this.postService.getPostsByUserId(this.profileInfo.id).subscribe({
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
*/

ngOnInit() {

  // First, get the user ID from the route params (no authentication required for this)
  this.route.paramMap.subscribe(params => {
    this.userId = params.get('id');

    if (this.userId) {
      // Fetch the user profile
      this.userService.getUser(Number(this.userId)).subscribe({
        next: (user: User) => {
          this.profileInfo = user;

          // Fetch likes and posts for any profile, whether the user is authenticated or not
          this.fetchLikesAndPosts(this.profileInfo.id);

          // If the current user is viewing their own profile, redirect to /myprofile
          this.authenticationService.userInfo$.subscribe(userInfo => {
            this.userInfo = userInfo;
            if (this.userInfo?.id === this.profileInfo.id) {
              window.location.href = '/myprofile';
              return;
            }
          });

          // Fetch followers and following regardless of authentication
          this.fetchFollowersAndFollowing(this.profileInfo.id);
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
          this.router.navigate(['/']);
        }
      });
    }
  });


  this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
    this.isAuthenticated = isAuthenticated; 
    this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
    this.translationService.translations$.subscribe(translations => this.translations = translations);           
  });  
}

fetchFollowersAndFollowing(userId: number) {
  // Fetch followers
  this.userService.getFollowers(userId).subscribe({
    next: (followers: User[]) => {
      this.followers = followers;
      console.log('Followers:', this.followers);
    },
    error: (error) => {
      console.error('Error fetching followers:', error);
    }
  });

  // Fetch following
  this.userService.getFollowing(userId).subscribe({
    next: (following: User[]) => {
      this.following = following;
      console.log('Following:', this.following);
    },
    error: (error) => {
      console.error('Error fetching following:', error);
    }
  });
}

fetchLikesAndPosts(userId: number) {
  // Fetch likes
  this.likeService.getLikesByUserId(userId).subscribe({
    next: (response: Like[]) => {
      this.likes = response;
    },
    error: (err: any) => {
      console.error('Error fetching likes:', err);
    }
  });

  // Fetch posts
  this.postService.getPostsByUserId(userId).subscribe({
    next: (response: Post[]) => {
      this.posts = response;
    },
    error: (err: any) => {
      console.error('Error fetching posts:', err);
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

}
