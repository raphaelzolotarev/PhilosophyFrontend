import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
  @Input() translations : { [key: string]: string } = TRANSLATION_EN;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.currentTranslations$.subscribe((translations) => {
      this.translations = translations;
    });
  }
  
}
