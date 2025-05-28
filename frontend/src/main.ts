import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routes } from './routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { isDevMode } from '@angular/core';
import { environment } from './environments/environment';

console.log('Environment:', environment);
console.log('API URL:', environment.apiUrl);
console.log('Is production:', environment.production);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
