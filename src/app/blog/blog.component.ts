import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { PostService } from '../post.service';
import { Post } from '../post';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})

export class BlogComponent {

  public allPosts: any = null;
  public translations: { [key: string]: string }  = TRANSLATION_EN;
  constructor(private route: ActivatedRoute, private postService: PostService, private translationService: TranslationService) {
    this.translationService.translations$.subscribe(translations => this.translations = translations);     
        this.postService.getPosts().subscribe(posts => {this.allPosts = posts;});
  }

  ngOnInit() {

        this.route.queryParams.subscribe(params => {
          const keyword = params['search'];
          if (keyword) {
            this.searchPosts(keyword);
          }
          const keywordTag = params['tag'];
          if (keywordTag) {
            this.searchPostsByTag(keywordTag);
          }
        });
  }
  

      //search 
      searchPosts(keyword: string | null): void {
        if(keyword == null) keyword="";
        this.postService.searchPosts(keyword).subscribe({
          next: (response: Post[]) => {
            this.allPosts = response;
          },
          error: (error: HttpErrorResponse) => {
            alert(error.message);
          }
        });
      }
      searchPostsByTag(keyword: string | null): void {
        if(keyword == null) keyword="";
        this.postService.searchPostsByTag(keyword).subscribe({
          next: (response: Post[]) => {
            this.allPosts = response;
          },
          error: (error: HttpErrorResponse) => {
            console.error(error.message);
          }
        });
      }

}
