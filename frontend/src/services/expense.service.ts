import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, ExpenseCreateRequest, ExpenseUpdateRequest } from '../models/expense.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${environment.apiUrl}/expenses`);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${environment.apiUrl}/expenses/${id}`);
  }

  createExpense(expense: ExpenseCreateRequest): Observable<Expense> {
    return this.http.post<Expense>(`${environment.apiUrl}/expenses`, expense);
  }

  updateExpense(id: number, expense: ExpenseUpdateRequest): Observable<Expense> {
    return this.http.put<Expense>(`${environment.apiUrl}/expenses/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/expenses/${id}`);
  }
} 