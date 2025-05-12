import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="close()">&times;</button>
        
        <h2>Dlaczego Finanzo?</h2>
        <p class="modal-description">
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
            <p>Finanzo jest całkowicie darmowe. Nie ma ukrytych opłat, reklam ani ograniczeń funkcjonalności.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      animation: slideIn 0.3s ease;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #2c3e50;
      padding: 0.5rem;
      line-height: 1;
      transition: transform 0.3s ease;
    }

    .close-button:hover {
      transform: scale(1.1);
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .modal-description {
      text-align: center;
      color: #7f8c8d;
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 15px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card i {
      font-size: 2.5rem;
      color: #3498db;
      margin-bottom: 1.5rem;
      display: block;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }

    .feature-card p {
      color: #7f8c8d;
      line-height: 1.6;
      margin: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 768px) {
      .modal-content {
        padding: 1.5rem;
      }

      h2 {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FeaturesModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
} 