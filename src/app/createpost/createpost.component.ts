import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { PostService } from '../post.service';
import { Post } from '../post';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../user';

@Component({
  selector: 'app-createpost',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './createpost.component.html',
  styleUrl: './createpost.component.scss'
})
export class CreatepostComponent {

  //form
  author: User | null = null;
  title: string = '';
  imageUrl: string = '';
  category : string = '';
  description: string = '';

  //user status
  public userInfo: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private postService: PostService, private router: Router, private translationService: TranslationService, private authenticationService : AuthenticationService) {      }

  ngOnInit() {
    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated;    
        });  
        this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
        this.translationService.translations$.subscribe(translations => this.translations = translations);
      
        //only admin has access
        if(this.userInfo.role == 'USER'){
          this.router.navigate(['/']);
        }

        
        this.author = this.userInfo;

        console.log(this.author);
      }            
    });    
  }

    //CREATE NEW POST
    public onAddPost(addForm: NgForm): void{
      //1. create post
      this.postService.addPost(addForm.value).subscribe({
        next: (response: Post) => {
            //2. redirect to blog page
            this.router.navigate(['/blog']).then(() => {
              window.location.reload();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        },
        error: (error: HttpErrorResponse) => {
          console.error("error making new post");
        }
      });
    }


}
