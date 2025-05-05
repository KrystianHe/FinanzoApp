import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="statistics-container">
      <h1>Statystyki</h1>
      <div class="filters">
        <select class="filter-select">
          <option value="month">Ten miesiąc</option>
          <option value="quarter">Ten kwartał</option>
          <option value="year">Ten rok</option>
          <option value="custom">Niestandardowy zakres</option>
        </select>
      </div>
      <div class="charts-grid">
        <div class="card">
          <h3>Wydatki według kategorii</h3>
          <div class="chart-placeholder">
            <p class="chart-message">Wykres kołowy wydatków według kategorii</p>
            <div class="mock-pie-chart">
              <div class="pie-slice slice-1"></div>
              <div class="pie-slice slice-2"></div>
              <div class="pie-slice slice-3"></div>
              <div class="pie-slice slice-4"></div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color" style="background-color: #4e73df;"></span>
              <span>Jedzenie (35%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #1cc88a;"></span>
              <span>Transport (15%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #36b9cc;"></span>
              <span>Mieszkanie (40%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: #f6c23e;"></span>
              <span>Rozrywka (10%)</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Trendy wydatków</h3>
          <div class="chart-placeholder">
            <p class="chart-message">Wykres liniowy trendów miesięcznych</p>
            <div class="mock-line-chart">
              <div class="line-point" style="height: 20%;"></div>
              <div class="line-point" style="height: 40%;"></div>
              <div class="line-point" style="height: 30%;"></div>
              <div class="line-point" style="height: 70%;"></div>
              <div class="line-point" style="height: 50%;"></div>
              <div class="line-point" style="height: 60%;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>Podsumowanie</h3>
        <div class="stats-summary">
          <div class="summary-item">
            <h4>Całkowity przychód</h4>
            <p class="amount positive">10,500.00 zł</p>
          </div>
          <div class="summary-item">
            <h4>Całkowite wydatki</h4>
            <p class="amount negative">6,240.00 zł</p>
          </div>
          <div class="summary-item">
            <h4>Oszczędności</h4>
            <p class="amount">4,260.00 zł</p>
          </div>
          <div class="summary-item">
            <h4>Najwyższy wydatek</h4>
            <p>Mieszkanie: 2,500.00 zł</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      width: 100%;
    }
    
    .filters {
      margin: 1rem 0;
    }
    
    .filter-select {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .chart-placeholder {
      height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;
      border-radius: 4px;
      margin: 1rem 0;
    }
    
    .chart-message {
      color: #6c757d;
      text-align: center;
    }
    
    .mock-pie-chart {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      background: #eee;
    }
    
    .pie-slice {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-origin: center;
    }
    
    .slice-1 {
      background: #4e73df;
      clip-path: polygon(50% 50%, 100% 0, 100% 100%);
    }
    
    .slice-2 {
      background: #1cc88a;
      clip-path: polygon(50% 50%, 100% 100%, 0 100%, 0 50%);
    }
    
    .slice-3 {
      background: #36b9cc;
      clip-path: polygon(50% 50%, 0 50%, 0 0);
    }
    
    .slice-4 {
      background: #f6c23e;
      clip-path: polygon(50% 50%, 0 0, 100% 0);
    }
    
    .mock-line-chart {
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 150px;
      gap: 5%;
      padding: 0 10px;
    }
    
    .line-point {
      flex: 1;
      background: linear-gradient(to top, #4e73df, #36b9cc);
      border-radius: 2px 2px 0 0;
    }
    
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .legend-color {
      display: block;
      width: 15px;
      height: 15px;
      border-radius: 3px;
    }
    
    .stats-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .summary-item {
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .summary-item h4 {
      margin: 0;
      color: #6c757d;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .amount {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }
    
    .positive {
      color: #28a745;
    }
    
    .negative {
      color: #dc3545;
    }
  `]
})
export class StatisticsComponent {
} 