import { Component, Input } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TRANSLATION_EN } from '../translation';
import { TranslationService } from '../translation.service'

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() userInfo: any;
  @Input() isAuthenticated: boolean = false;
  @Input() preferredLanguage: string = 'EN';
  @Input() role: string = 'VISITOR';
  @Input() translations : { [key: string]: string } = TRANSLATION_EN;

  constructor(private translationService: TranslationService) {}

  //language switcher sender
  public onLanguageClick(lang: string): void {
    this.preferredLanguage = lang.toUpperCase(); 
    this.translationService.switchLanguage(this.preferredLanguage);
  }
  ngOnInit(): void {
    this.translationService.currentTranslations$.subscribe((translations) => {
      this.translations = translations;
    });
  }
}
