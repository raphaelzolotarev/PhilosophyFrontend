import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent{

  public translations: { [key: string]: string }  = TRANSLATION_EN;

  constructor(private translationService: TranslationService) {    
    this.translationService.translations$.subscribe(translations => this.translations = translations);
  }

}
