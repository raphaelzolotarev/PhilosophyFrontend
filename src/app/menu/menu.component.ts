import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service'
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';
import { PostService } from '../post.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent {

  //user status
  public userInfo: any = null;
  public role: string = 'USER';
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;
  public selectedLang: string = 'EN';
  
  //CONSTRUCTOR
  constructor(private translationService: TranslationService, private postService: PostService, private authenticationService: AuthenticationService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated;    
        });  
        this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
        this.translationService.translations$.subscribe(translations => this.translations = translations);
        this.translationService.selectedLang$.subscribe(selectedLang => this.selectedLang = selectedLang); 
      }
    });
  }

  //CHANGE LAGUAGE
  onLanguageClick(lang: string): void { 
    this.translationService.switchLanguage(lang.toUpperCase());
    this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
      if(isAuthenticated){
        this.userService.updateUserLang(this.userInfo.username, lang.toUpperCase()).subscribe({
          next: () => console.log("Request completed"),
          error: error => console.log("Request failed", error),
        });
      }
    });
  }

  //LOGOUT
  onLogoutClick(): void{
      this.authenticationService.logout();
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
  }

  //NIGHT MODE
  toggleNightMode() {
    const nightMode = localStorage.getItem('gmtNightMode');
    if (nightMode === 'true') {
        document.documentElement.classList.add('night-mode');
    } else {
        document.documentElement.classList.remove('night-mode');
    }
    document.documentElement.classList.toggle('night-mode');
    if (document.documentElement.classList.contains('night-mode')) {
        localStorage.setItem('gmtNightMode', 'true');
    } else {
        localStorage.setItem('gmtNightMode', 'false');
    }
  }

  //search
  searchPosts(keyword: string | null): void {
    if (keyword == null) keyword = "";
    this.router.navigate(['/blog'], { queryParams: { search: keyword } });
  }
  
}
