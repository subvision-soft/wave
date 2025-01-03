import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LocaleService {
  private localeSubject = new BehaviorSubject<string>(localStorage.getItem('locale') || 'fr-FR');

  get locale(): string {
    return this.localeSubject.value;
  }

  setLocale(locale: string) {
    localStorage.setItem('locale', locale);
    this.localeSubject.next(locale);
    location.reload();
  }
}
