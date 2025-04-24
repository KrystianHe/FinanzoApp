export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  userId: number;
}

export interface ExpenseCreateRequest {
  amount: number;
  description: string;
  date: string;
  category: string;
}

export interface ExpenseUpdateRequest {
  amount?: number;
  description?: string;
  date?: string;
  category?: string;
} 