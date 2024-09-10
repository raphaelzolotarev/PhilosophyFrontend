import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  public isPasswordVisible: boolean = false;  
  public username: string = '';
  public password: string = '';
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private translationService: TranslationService, private router: Router, private authenticationService: AuthenticationService) {     }

  //IF LOGGED REDIRECT
  ngOnInit() {
    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated;            
          if (isAuthenticated) {
            this.router.navigate(['/']);
          }
        });  
        this.translationService.translations$.subscribe(translations => this.translations = translations);
      }
    });
  }

  //LOGIN PROCESS 
  onSubmit() {
    this.authenticationService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          this.authenticationService.storeToken(response.token);
          //redirect to homepage after login
          this.router.navigate(['/myprofile']).then(() => {
            window.location.reload();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        },
        error: (error) => {
          const alertElement = document.getElementById('alert');
          if (alertElement) {
              alertElement.style.display = 'block';
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        complete: () => {
          console.log('Request completed');
        }
      });
  }

  //JS METHOD TO SHOW PASS
  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput && eyeIcon) {
        this.isPasswordVisible = !this.isPasswordVisible;

        if (this.isPasswordVisible) {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('feather-eye-off');
            eyeIcon.classList.add('feather-eye');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('feather-eye');
            eyeIcon.classList.add('feather-eye-off');
        }
    }
}  

}
