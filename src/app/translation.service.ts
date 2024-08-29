import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TRANSLATION_EN, TRANSLATION_FR, TRANSLATION_NL } from './translation';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translationsSubject = new BehaviorSubject<{ [key: string]: string }>(TRANSLATION_EN);
  currentTranslations$ = this.translationsSubject.asObservable();

  switchLanguage(lang: string): void {
    let selectedTranslations;
    if (lang === 'EN') {
      selectedTranslations = TRANSLATION_EN;
    } else if (lang === 'FR') {
      selectedTranslations = TRANSLATION_FR;
    } else {
      selectedTranslations = TRANSLATION_NL;
    }
    this.translationsSubject.next(selectedTranslations);
  }
}
