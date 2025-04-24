import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../../services/expense.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="expense-list-container">
      <h2>Moje wydatki</h2>
      <button (click)="addNewExpense()">Dodaj nowy wydatek</button>
      <div class="expense-list">
        <div *ngFor="let expense of expenses" class="expense-item">
          <div class="expense-info">
            <span class="amount">{{expense.amount}} zł</span>
            <span class="description">{{expense.description}}</span>
            <span class="category">{{expense.category}}</span>
            <span class="date">{{expense.date | date}}</span>
          </div>
          <div class="expense-actions">
            <button (click)="editExpense(expense.id)">Edytuj</button>
            <button (click)="deleteExpense(expense.id)">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expense-list-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .expense-list {
      margin-top: 20px;
    }
    .expense-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .expense-info {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .amount {
      font-weight: bold;
      color: #dc3545;
    }
    .expense-actions {
      display: flex;
      gap: 10px;
    }
    button {
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:first-child {
      background-color: #007bff;
      color: white;
    }
    button:last-child {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class ExpenseListComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
        return;
      }
      this.loadExpenses();
    });
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
      },
      error: (error) => {
        console.error('Błąd podczas ładowania wydatków:', error);
      }
    });
  }

  addNewExpense(): void {
    this.router.navigate(['/expenses/new']);
  }

  editExpense(id: number): void {
    this.router.navigate(['/expenses', id, 'edit']);
  }

  deleteExpense(id: number): void {
    if (confirm('Czy na pewno chcesz usunąć ten wydatek?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (error) => {
          console.error('Błąd podczas usuwania wydatku:', error);
        }
      });
    }
  }
} 