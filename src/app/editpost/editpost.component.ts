import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-editpost',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent {

  public postId: string | null = null;
  public post: any = null;

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

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router, private translationService: TranslationService, private authenticationService : AuthenticationService) {      }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id'); 
      if (this.postId) {
        this.postService.getPost(Number(this.postId)).subscribe({
          next: (post: Post) => {
            this.post = post; 
            this.author = this.post.author;
            this.title = this.post.title;
            this.imageUrl = this.post.imageUrl;
            this.category = this.post.category;
            this.description = this.post.description;
          },
          error: (error) => {
            this.router.navigate(['/blog']);
          }
        });
      }
    });

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
      }            
    });    
  }

    //EDIT POST
    public updatePost(addForm: NgForm): void   { 
      const formData = {
        ...addForm.value,  
        id: this.postId         
      };
      this.postService.updatePost(formData).subscribe({
        next: (response: Post) => {
            this.router.navigate(['/postdetails/'+this.postId]).then(() => {
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
