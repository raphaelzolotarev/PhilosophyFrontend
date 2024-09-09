import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../user';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {

  isPasswordVisible: boolean = false;
 
  username: string = '';
  password: string = '';
  email: string = '';
  gender: string = '';
  preferredLanguage: string = '';
  termsAccepted: boolean = false;
  public isAuthenticated: boolean = false;

  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private userService: UserService, private translationService: TranslationService, private router: Router, private authenticationService: AuthenticationService) {    }

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
        this.translationService.selectedLang$.subscribe(selectedLang => this.preferredLanguage = selectedLang);
      }
    });
  }

  //REGISTRATION PROCESS
  public onAddUser(addForm: NgForm): void{
    //1. create user
    this.userService.addUser(addForm.value).subscribe({
      next: (response: User) => {
          //2. login user
          this.authenticationService.login(this.username, this.password)
          .subscribe({
            next: (response) => {
              this.authenticationService.storeToken(response.token);
              this.router.navigate(['/myprofile']).then(() => {
                window.location.reload();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            }
          });
      },
      error: (error: HttpErrorResponse) => {
        const alertElement = document.getElementById('alert');
            if (alertElement) {
                alertElement.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
