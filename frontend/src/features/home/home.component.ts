import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParticlesComponent } from '../shared/components/particles.component';
import { FeaturesModalComponent } from '../shared/components/features-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ParticlesComponent, FeaturesModalComponent],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <app-particles></app-particles>
        <div class="hero-content">
          <div class="logo">
            <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo-img">
          </div>
          <h1>Witaj w Finanzo</h1>
          <p class="subtitle">
            Inteligentna aplikacja do zarządzania finansami osobistymi.
            Kontroluj wydatki, planuj budżet i osiągaj swoje cele finansowe.
          </p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn primary">Zarejestruj się za darmo</a>
            <a routerLink="/login" class="btn secondary">Zaloguj się</a>
          </div>
          <button class="pulse-button" (click)="showFeaturesModal = true">
            Dlaczego Finanzo?
          </button>
        </div>
        <div class="watermark">Created by Kryha</div>
      </div>

      <app-features-modal
        *ngIf="showFeaturesModal"
        (closeModal)="showFeaturesModal = false">
      </app-features-modal>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      position: relative;
    }

    .hero-section {
      position: relative;
      padding: 6rem 2rem;
      text-align: center;
      color: white;
      overflow: hidden;
      background: #14162E;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo {
      margin-bottom: 1.5rem;
    }

    .logo-img {
      width: 180px;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .hero-section h1 {
      font-size: 4.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .subtitle {
      font-size: 1.25rem;
      max-width: 800px;
      margin: 0 auto 2rem;
      line-height: 1.6;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .btn {
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn.primary {
      background: white;
      color: #1e4976;
    }

    .btn.secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .btn.primary:hover {
      background: #f8f9fa;
    }

    .btn.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .pulse-button {
      position: relative;
      background: linear-gradient(45deg, #fcf9f9, #544f4f);
      color: white;
      border: none;
      border-radius: 30px;
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      transition: all 0.3s ease;
      margin-top: 2rem;
      animation: pulse 2s infinite;
    }

    .pulse-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      animation-play-state: paused;
    }

    .pulse-button:active {
      transform: translateY(0);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }

    .watermark {
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      font-style: italic;
      z-index: 2;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      letter-spacing: 1px;
    }

    .watermark:hover {
      color: rgba(255, 255, 255, 0.8);
      transition: color 0.3s ease;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 3rem;
      }

      .subtitle {
        font-size: 1.1rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 300px;
        text-align: center;
      }

      .watermark {
        font-size: 0.8rem;
      }
    }
  `]
})
export class HomeComponent {
  showFeaturesModal = false;

  openWhyFinanzoModal() {
    alert('Finanzo to nowoczesna aplikacja do zarządzania finansami osobistymi, która pomaga śledzić wydatki, planować budżet i osiągać cele oszczędnościowe.');
  }
}
