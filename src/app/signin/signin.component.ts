import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { LoginService } from '../login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  username: string = '';
  password: string = '';

  @Input() translations : { [key: string]: string } = TRANSLATION_EN;

  constructor(private translationService: TranslationService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.translationService.currentTranslations$.subscribe((translations) => {
      this.translations = translations;
    });
  }


  onSubmit() {
    this.loginService.login(this.username, this.password)
      .subscribe({
        next: (response) => {
          console.log('Login successful');
          this.loginService.storeToken(response.token);
          console.log('token'+ this.loginService.getToken());
        },
        error: (error) => {
          console.error('Login failed', error);
        },
        complete: () => {
          console.log('Request completed');
        }
      });
  }
  

}
