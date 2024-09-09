import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})

export class CommunityComponent {

  public userInfo: any = null;
  public canDo: boolean = false;
  public allUsers: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private userService: UserService, private router: Router, private translationService: TranslationService, private authenticationService : AuthenticationService) {   

    
     }

  ngOnInit() { 

    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      
      if(this.userInfo == null){
        this.canDo = true;
      }

      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {this.isAuthenticated = isAuthenticated;});  
        this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
        
        if(this.userInfo != null){
          this.canDo = false;
        }
      }  

      this.translationService.translations$.subscribe(translations => this.translations = translations);     
      this.userService.getUsers().subscribe(users => {this.allUsers = users;}); 
      
    });
    
  }

  //follow user button
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


  //search 
  searchUsers(keyword: string | null): void {
    if(keyword == null) keyword="";
    this.userService.searchUsers(keyword).subscribe({
      next: (response: User[]) => {
        this.allUsers = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }




}

