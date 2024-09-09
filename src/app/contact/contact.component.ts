import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  //user status
  public userInfo: any = null;
  public isAuthenticated: boolean = false;
  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private translationService: TranslationService, private authenticationService : AuthenticationService) {      }

  ngOnInit() {
    this.authenticationService.isInitialized$.subscribe((isInitialized) => {
      if (isInitialized) {
        this.authenticationService.isAuthenticated$.subscribe(isAuthenticated => {
          this.isAuthenticated = isAuthenticated;    
        });  
        this.authenticationService.userInfo$.subscribe(userInfo => this.userInfo = userInfo);
        this.translationService.translations$.subscribe(translations => this.translations = translations);
      }
    });
  }

}
