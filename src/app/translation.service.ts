import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TRANSLATION_EN, TRANSLATION_FR, TRANSLATION_NL } from './translation';

@Injectable({
  providedIn: 'root'
})

export class TranslationService {

  private translationsSubject = new BehaviorSubject<{ [key: string]: string }>(TRANSLATION_EN);
  translations$ = this.translationsSubject.asObservable();

  private selectedLangSubject = new BehaviorSubject<string>('EN');
  selectedLang$ = this.selectedLangSubject.asObservable();

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
    this.selectedLangSubject.next(lang);
  }

}
