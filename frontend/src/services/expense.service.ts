import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expense, ExpenseCreateRequest, ExpenseUpdateRequest } from '../models/expense.model';
import { environment } from '../environments/environment';

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface ExpenseWithCategory extends Expense {
  categoryObj: Category;
}

export interface ExpenseByCategory {
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = environment.apiUrl;

  // Dane testowe na potrzeby UI
  private mockCategories: Category[] = [
    { id: 1, name: 'Jedzenie', color: '#FF6384' },
    { id: 2, name: 'Transport', color: '#36A2EB' },
    { id: 3, name: 'Rozrywka', color: '#FFCE56' },
    { id: 4, name: 'Mieszkanie', color: '#4BC0C0' },
    { id: 5, name: 'Zdrowie', color: '#9966FF' },
    { id: 6, name: 'Ubrania', color: '#FF9F40' },
    { id: 7, name: 'Edukacja', color: '#C9CBCF' }
  ];

  // Mapa nazw kategorii do obiektów kategorii
  private categoryMap: Record<string, Category> = this.mockCategories.reduce((map, cat) => {
    map[cat.name] = cat;
    return map;
  }, {} as Record<string, Category>);

  private mockExpenses: Expense[] = [
    { id: 1, amount: 350, category: 'Jedzenie', date: '2023-05-10', description: 'Zakupy spożywcze', userId: 1 },
    { id: 2, amount: 220, category: 'Transport', date: '2023-05-12', description: 'Paliwo', userId: 1 },
    { id: 3, amount: 150, category: 'Rozrywka', date: '2023-05-15', description: 'Kino', userId: 1 },
    { id: 4, amount: 1200, category: 'Mieszkanie', date: '2023-05-01', description: 'Czynsz', userId: 1 },
    { id: 5, amount: 120, category: 'Zdrowie', date: '2023-05-05', description: 'Leki', userId: 1 },
    { id: 6, amount: 300, category: 'Ubrania', date: '2023-05-08', description: 'Kurtka', userId: 1 },
    { id: 7, amount: 200, category: 'Edukacja', date: '2023-05-20', description: 'Kurs online', userId: 1 },
    { id: 8, amount: 180, category: 'Jedzenie', date: '2023-05-18', description: 'Restauracja', userId: 1 },
    { id: 9, amount: 150, category: 'Transport', date: '2023-05-25', description: 'Uber', userId: 1 }
  ];

  constructor(private http: HttpClient) {}

  // Docelowo te metody będą pobierać dane z API
  getCategories(): Observable<Category[]> {
    // return this.http.get<Category[]>(`${this.API_URL}/categories`);
    return of(this.mockCategories);
  }

  getAllExpenses(): Observable<Expense[]> {
    // W prawdziwej implementacji pobieralibyśmy z API
    return of(this.mockExpenses);
  }

  // Pomocnicza metoda do mapowania wydatków na wydatki z pełnymi obiektami kategorii
  private mapExpensesToFullCategories(expenses: Expense[]): ExpenseWithCategory[] {
    return expenses.map(expense => ({
      ...expense,
      categoryObj: this.categoryMap[expense.category] || {
        id: 0,
        name: expense.category,
        color: '#CCCCCC'
      }
    }));
  }

  getExpensesByCategory(): Observable<ExpenseByCategory[]> {
    return this.getAllExpenses().pipe(
      map(expenses => {
        const expensesWithCategories = this.mapExpensesToFullCategories(expenses);

        const totalExpenses = expensesWithCategories.reduce((sum, expense) => sum + expense.amount, 0);

        const expensesByCategory = expensesWithCategories.reduce((result, expense) => {
          const categoryName = expense.category;

          if (!result[categoryName]) {
            result[categoryName] = {
              categoryName: expense.category,
              categoryColor: expense.categoryObj.color,
              totalAmount: 0,
              percentage: 0
            };
          }

          result[categoryName].totalAmount += expense.amount;
          return result;
        }, {} as Record<string, ExpenseByCategory>);

        const result = Object.values(expensesByCategory).map(item => {
          item.percentage = (item.totalAmount / totalExpenses) * 100;
          return item;
        });

        return result.sort((a, b) => b.totalAmount - a.totalAmount);
      })
    );
  }

  getTotalExpenses(): Observable<number> {
    return this.getAllExpenses().pipe(
      map(expenses => expenses.reduce((sum, expense) => sum + expense.amount, 0))
    );
  }

  getExpenseChangePercentage(): Observable<number> {
    // W prawdziwej aplikacji porównywalibyśmy sumę z bieżącego miesiąca z poprzednim
    // Tutaj zwracamy fikcyjną wartość
    return of(-8);
  }

  // Istniejące metody z ExpenseService
  createExpense(expense: ExpenseCreateRequest): Observable<Expense> {
    return this.http.post<Expense>(`${this.API_URL}/expenses`, expense);
  }

  updateExpense(id: number, expense: ExpenseUpdateRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.API_URL}/expenses/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/expenses/${id}`);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.API_URL}/expenses/${id}`);
  }
}
