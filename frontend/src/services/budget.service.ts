import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Budget {
  id: number;
  name: string;
  amount: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.apiUrl);
  }

  getActiveBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/active`);
  }

  getUpcomingBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/upcoming`);
  }

  getPastBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/past`);
  }

  getBudgetsByCategory(category: string): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/category/${category}`);
  }

  createBudget(budget: Partial<Budget>): Observable<Budget> {
    return this.http.post<Budget>(this.apiUrl, budget);
  }

  updateBudget(id: number, budget: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${id}`, budget);
  }

  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addSpending(id: number, amount: number): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${id}/add-spending`, null, {
      params: { amount: amount.toString() }
    });
  }

  removeSpending(id: number, amount: number): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${id}/remove-spending`, null, {
      params: { amount: amount.toString() }
    });
  }
}
