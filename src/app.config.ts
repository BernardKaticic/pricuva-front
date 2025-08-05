import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' }
      },
      translation: {
        accept: 'Da',
        reject: 'Ne',
        dayNames: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
        dayNamesShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
        dayNamesMin: ["N", "P", "U", "S", "Č", "P", "S"],
        monthNames: [
          "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj",
          "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
        ],
        monthNamesShort: [
          "Sij", "Vel", "Ožu", "Tra", "Svi", "Lip",
          "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"
        ],
        today: 'Danas',
        clear: 'Očisti',
        dateFormat: 'dd.mm.yy',
        firstDayOfWeek: 1
      }
    })
  ]
};
