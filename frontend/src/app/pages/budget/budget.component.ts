import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-container">
      <h1>Budżet</h1>
      <div class="actions-bar">
        <button class="btn btn-primary">Utwórz nowy budżet</button>
      </div>
      <div class="card">
        <h3>Budżet na Maj 2025</h3>
        <div class="budget-progress">
          <div class="progress-label">
            <span>Wykorzystano: 2,500 zł z 4,000 zł</span>
            <span>62.5%</span>
          </div>
          <div class="progress-bar">
            <div class="progress" style="width: 62.5%"></div>
          </div>
        </div>
        <div class="budget-categories">
          <div class="category-item">
            <div class="category-header">
              <h4>Jedzenie</h4>
              <span>750 zł / 1,000 zł</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: 75%"></div>
            </div>
          </div>
          <div class="category-item">
            <div class="category-header">
              <h4>Transport</h4>
              <span>300 zł / 500 zł</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: 60%"></div>
            </div>
          </div>
          <div class="category-item">
            <div class="category-header">
              <h4>Rozrywka</h4>
              <span>450 zł / 500 zł</span>
            </div>
            <div class="progress-bar">
              <div class="progress warning" style="width: 90%"></div>
            </div>
          </div>
          <div class="category-item">
            <div class="category-header">
              <h4>Mieszkanie</h4>
              <span>1,000 zł / 2,000 zł</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: 50%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .budget-container {
      width: 100%;
    }
    
    .actions-bar {
      margin: 1rem 0;
    }
    
    .budget-progress {
      margin: 1.5rem 0;
    }
    
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .progress-bar {
      height: 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress {
      height: 100%;
      background-color: #28a745;
      border-radius: 4px;
    }
    
    .progress.warning {
      background-color: #ffc107;
    }
    
    .budget-categories {
      margin-top: 2rem;
    }
    
    .category-item {
      margin-bottom: 1.5rem;
    }
    
    .category-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .category-header h4 {
      margin: 0;
    }
  `]
})
export class BudgetComponent {
} 