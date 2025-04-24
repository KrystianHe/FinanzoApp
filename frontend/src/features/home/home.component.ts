import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>MojeWydatki</h1>
          <p class="subtitle">
            Inteligentna aplikacja do zarządzania finansami osobistymi. Kontroluj wydatki, planuj budżet i osiągaj swoje cele finansowe.
          </p>
          <div class="cta-buttons">
            <a routerLink="/register" class="btn primary">Zarejestruj się za darmo</a>
            <a routerLink="/login" class="btn secondary">Zaloguj się</a>
          </div>
        </div>
      </div>

      <section class="features">
        <h2>Dlaczego MojeWydatki?</h2>
        <p class="section-description">
          Nasza aplikacja pomaga w efektywnym zarządzaniu finansami osobistymi dzięki intuicyjnym narzędziom i przejrzystym statystykom.
        </p>

        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-chart-line"></i>
            <h3>Śledzenie wydatków</h3>
            <p>Łatwe rejestrowanie i kategoryzowanie wydatków na bieżąco. Wydatki możesz dodawać szybko i wygodnie z każdego urządzenia.</p>
          </div>

          <div class="feature-card">
            <i class="fas fa-chart-bar"></i>
            <h3>Zaawansowane statystyki</h3>
            <p>Przejrzyste wykresy i raporty pomagające zrozumieć, na co wydajesz pieniądze. Analizuj swoje wydatki według kategorii i planuj budżet.</p>
          </div>

          <div class="feature-card">
            <i class="fas fa-mobile-alt"></i>
            <h3>Dostęp z każdego urządzenia</h3>
            <p>Aplikacja dostępna na komputerze, tablecie i telefonie - zawsze miej swoje finanse pod kontrolą, gdziekolwiek jesteś.</p>
          </div>

          <div class="feature-card">
            <i class="fas fa-shield-alt"></i>
            <h3>Bezpieczeństwo danych</h3>
            <p>Twoje dane finansowe są bezpieczne dzięki zaawansowanym technologiom szyfrowania i dwuetapowej weryfikacji logowania.</p>
          </div>

          <div class="feature-card">
            <i class="fas fa-file-alt"></i>
            <h3>Raportowanie</h3>
            <p>Generuj i eksportuj raporty finansowe za dowolny okres. Pobieraj dane w formatach CSV i PDF do dalszej analizy.</p>
          </div>

          <div class="feature-card">
            <i class="fas fa-gift"></i>
            <h3>Za darmo!</h3>
            <p>MojeWydatki jest całkowicie darmowe. Nie ma ukrytych opłat, reklam ani ograniczeń funkcjonalności.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }

    .hero-section {
      position: relative;
      background-image: url('/assets/images/finance-bg.jpg');
      background-size: cover;
      background-position: center;
      padding: 6rem 2rem;
      text-align: center;
      color: white;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(41, 128, 185, 0.9), rgba(44, 62, 80, 0.9));
      z-index: 1;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
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
      color: #2980b9;
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

    .features {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .features h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .section-description {
      text-align: center;
      color: #7f8c8d;
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card i {
      font-size: 2rem;
      color: #3498db;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .feature-card p {
      color: #7f8c8d;
      line-height: 1.6;
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

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {} 