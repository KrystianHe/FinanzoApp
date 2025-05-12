import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ParticlesComponent } from '../shared/components/particles.component';
import { ExpenseService, ExpenseByCategory } from '../../services/expense.service';
import { Chart, registerables } from 'chart.js';

// Rejestracja wszystkich komponentów Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ParticlesComponent],
  template: `
    <div class="dashboard-layout">
      <div class="sidebar">
        <div class="logo-container">
          <img src="assets/finanzo-logo.jpg" alt="Finanzo" class="logo">
        </div>
        <div class="sidebar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="menu-item">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/transactions" routerLinkActive="active" class="menu-item">
            <i class="fas fa-wallet"></i>
            <span>Transakcje</span>
          </a>
          <a routerLink="/analytics" routerLinkActive="active" class="menu-item">
            <i class="fas fa-chart-pie"></i>
            <span>Analityka</span>
          </a>
          <a routerLink="/savings" routerLinkActive="active" class="menu-item">
            <i class="fas fa-piggy-bank"></i>
            <span>Oszczędności</span>
          </a>
          <a routerLink="/goals" routerLinkActive="active" class="menu-item">
            <i class="fas fa-bullseye"></i>
            <span>Cele</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="menu-item">
            <i class="fas fa-cog"></i>
            <span>Ustawienia</span>
          </a>
          <div class="menu-separator"></div>
          <a (click)="logout()" class="menu-item logout-item">
            <i class="fas fa-sign-out-alt"></i>
            <span>Wyloguj się</span>
          </a>
        </div>
      </div>

      <div class="welcome-container">
        <div class="welcome-card">
          <h1>Witaj ponownie w Finanzo!</h1>
          <p>Wybierz co chcesz zrobić dzisiaj:</p>

          <div class="action-buttons">
            <div class="action-button" (click)="navigateTo('/transactions')">
              <i class="fas fa-exchange-alt"></i>
              <span>Zarządzaj Transakcjami</span>
            </div>
            <div class="action-button" (click)="navigateTo('/budgets')">
              <i class="fas fa-hand-holding-usd"></i>
              <span>Przeglądaj Budżety</span>
            </div>
            <div class="action-button" (click)="navigateTo('/analytics')">
              <i class="fas fa-chart-line"></i>
              <span>Analizuj Wydatki</span>
            </div>
            <div class="action-button" (click)="navigateTo('/goals')">
              <i class="fas fa-trophy"></i>
              <span>Ustaw Cele</span>
            </div>
          </div>

          <div class="quick-stats">
            <div class="stat-item">
              <h3>Twoje saldo</h3>
              <p class="stat-value">{{ totalExpenses | currency:'PLN':'symbol':'1.2-2' }}</p>
              <p class="stat-change" [class.positive]="expenseChangePercentage > 0" [class.negative]="expenseChangePercentage < 0">
                {{ expenseChangePercentage > 0 ? '+' : '' }}{{ expenseChangePercentage }}% w porównaniu z poprzednim miesiącem
              </p>
            </div>
            <div class="stat-item chart-container">
              <h3>Wykres wydatków</h3>
              <div class="chart-wrapper">
                <canvas #expensesChart></canvas>
              </div>
            </div>
          </div>
          
          <div class="categories-section">
            <h3>Kategorie wydatków</h3>
            <div class="categories-list">
              <div *ngFor="let category of expensesByCategory" class="category-item">
                <div class="category-color" [style.background-color]="category.categoryColor"></div>
                <div class="category-info">
                  <div class="category-name">{{ category.categoryName }}</div>
                  <div class="category-amount">{{ category.totalAmount | currency:'PLN':'symbol':'1.2-2' }}</div>
                </div>
                <div class="category-percentage">{{ category.percentage | number:'1.1-1' }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
    }

    .dashboard-layout {
      display: flex;
      height: 100%;
      background-color: #14162E;
      color: white;
    }

    .sidebar {
      width: 250px;
      background-color: #1A1C36;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    .logo-container {
      padding: 1.5rem;
      text-align: center;
    }

    .logo {
      width: 120px;
      height: auto;
      object-fit: contain;
      border-radius: 8px;
    }

    .sidebar-menu {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      height: 100%;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1.5rem;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .menu-item i {
      font-size: 1.2rem;
      width: 30px;
      margin-right: 0.5rem;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
      cursor: pointer;
    }

    .menu-item.active {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border-left: 3px solid #3b82f6;
    }

    .menu-separator {
      height: 1px;
      margin: auto 1.5rem 1rem;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .logout-item {
      margin-top: auto;
      margin-bottom: 1rem;
      color: #e55c5c;
    }

    .logout-item:hover {
      background: rgba(229, 92, 92, 0.1);
      color: #ff6b6b;
    }

    .welcome-container {
      flex: 1;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
    }

    .welcome-card {
      background: rgba(30, 31, 61, 0.5);
      padding: 2rem;
      border-radius: 1rem;
      width: 100%;
      max-width: 1500px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .welcome-card h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: white;
      text-align: center;
    }

    .welcome-card p {
      font-size: 1.1rem;
      color: #A0A0A0;
      margin-bottom: 2rem;
      text-align: center;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .action-button {
      background: rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-button:hover {
      background: rgba(59, 130, 246, 0.3);
      transform: translateY(-5px);
    }

    .action-button i {
      font-size: 2rem;
      color: #3b82f6;
    }

    .action-button span {
      font-size: 1rem;
      font-weight: 500;
      color: white;
      text-align: center;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .stat-item h3 {
      font-size: 1rem;
      color: #A0A0A0;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
    }

    .stat-change {
      font-size: 0.9rem;
    }

    .stat-change.positive {
      color: #4CAF50;
    }

    .stat-change.negative {
      color: #F44336;
    }

    .chart-container {
      display: flex;
      flex-direction: column;
    }

    .chart-wrapper {
      flex: 1;
      position: relative;
      min-height: 200px;
    }

    .categories-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .categories-section h3 {
      font-size: 1rem;
      color: #A0A0A0;
      margin-bottom: 1rem;
    }

    .categories-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      padding: 0.7rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .category-item:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .category-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 1rem;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .category-amount {
      color: #A0A0A0;
      font-size: 0.8rem;
      margin-top: 0.2rem;
    }

    .category-percentage {
      font-size: 0.9rem;
      font-weight: 600;
      color: #3b82f6;
    }

    @media (max-width: 768px) {
      .dashboard-layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        height: auto;
      }

      .sidebar-menu {
        flex-direction: row;
        overflow-x: auto;
        margin-top: 0;
      }

      .menu-item {
        padding: 0.8rem 1.2rem;
      }

      .menu-item i {
        margin-right: 0.3rem;
      }

      .menu-separator {
        width: 1px;
        height: auto;
        margin: 0 0.5rem;
      }

      .logout-item {
        margin-top: 0;
        margin-bottom: 0;
      }

      .quick-stats {
        grid-template-columns: 1fr;
      }

      .categories-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('expensesChart') expensesChart!: ElementRef<HTMLCanvasElement>;

  userEmail: string = '';
  currentDateTime: Date = new Date();
  totalExpenses: number = 0;
  expenseChangePercentage: number = 0;
  expensesByCategory: ExpenseByCategory[] = [];
  
  private dateTimeInterval: any;
  private chart: Chart | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    // Pobierz email użytkownika z localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.userEmail = JSON.parse(userData).email || 'Użytkownik';
    } else {
      this.userEmail = 'Użytkownik';
    }

    // Aktualizuj datę i czas co sekundę
    this.dateTimeInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    // Pobierz dane o wydatkach
    this.loadExpensesData();
  }

  ngAfterViewInit(): void {
    // Utworzenie wykresu po zainicjalizowaniu widoku
    this.createExpensesChart();
  }

  loadExpensesData(): void {
    // Pobierz sumę wydatków
    this.expenseService.getTotalExpenses().subscribe(total => {
      this.totalExpenses = total;
    });

    // Pobierz procentową zmianę wydatków
    this.expenseService.getExpenseChangePercentage().subscribe(percentage => {
      this.expenseChangePercentage = percentage;
    });

    // Pobierz wydatki według kategorii
    this.expenseService.getExpensesByCategory().subscribe(data => {
      this.expensesByCategory = data;
      this.updateChart();
    });
  }

  createExpensesChart(): void {
    if (this.expensesChart && this.expensesChart.nativeElement) {
      const ctx = this.expensesChart.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [],
              borderWidth: 0,
              hoverOffset: 5
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                    const percentage = Math.round((value / total) * 100);
                    return `${context.label}: ${value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });

        this.updateChart();
      }
    }
  }

  updateChart(): void {
    if (this.chart && this.expensesByCategory.length > 0) {
      this.chart.data.labels = this.expensesByCategory.map(cat => cat.categoryName);
      this.chart.data.datasets[0].data = this.expensesByCategory.map(cat => cat.totalAmount);
      this.chart.data.datasets[0].backgroundColor = this.expensesByCategory.map(cat => cat.categoryColor);
      
      this.chart.update();
    }
  }

  logout(): void {
    localStorage.removeItem('user_data');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Wyczyść interwał przy zniszczeniu komponentu
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval);
    }

    // Zniszcz wykres przy zniszczeniu komponentu
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
