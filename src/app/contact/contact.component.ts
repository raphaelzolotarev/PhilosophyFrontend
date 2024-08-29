import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @Input() translations : { [key: string]: string } = TRANSLATION_EN;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.currentTranslations$.subscribe((translations) => {
      this.translations = translations;
    });
  }

}
