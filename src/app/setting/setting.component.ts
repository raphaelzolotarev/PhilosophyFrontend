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
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})

export class SettingComponent {

  public password: string = '';
  public userInfo: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private userService: UserService, private translationService: TranslationService, private authenticationService : AuthenticationService, private router: Router) {  }

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
        }
      });
    }


  //EDIT USER
  onEditUser(addForm: NgForm): void{     
    const formData = {
      ...addForm.value,  
      id: this.userInfo.id,
      password: this.password          
    };
    this.userService.updateUser(formData).subscribe({
      next: (response: User) => {
          this.authenticationService.setUserInfo(response);
          this.showAlertSuccess();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }


  //SUCCESS ALERT
  showAlertSuccess(): void {
    const alertElement = document.getElementById('alertsuccesschanges');
    if (alertElement) {
      alertElement.classList.add('d-flex');
      alertElement.style.display = 'block';
      setTimeout(() => {
        alertElement.classList.remove('d-flex');
        alertElement.style.display = 'none';
      }, 3000);  
    }
  }

  
  //DELETE USER
  delete(userId: number): void{ 
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        window.location.href = '/';
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }
  

}
