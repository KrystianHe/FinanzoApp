import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../../../services/expense.service';
import { Expense, ExpenseCreateRequest, ExpenseUpdateRequest } from '../../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  isEditMode = false;
  editedExpense: Expense | null = null;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private dialogRef: MatDialogRef<ExpenseFormComponent>
  ) {
    this.expenseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.editedExpense) {
      this.isEditMode = true;
      this.expenseForm.patchValue({
        title: this.editedExpense.title,
        amount: this.editedExpense.amount,
        date: this.editedExpense.date,
        category: this.editedExpense.category,
        description: this.editedExpense.description
      });
    }
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formValue = this.expenseForm.value;
      
      if (this.isEditMode && this.editedExpense) {
        const updateRequest: ExpenseUpdateRequest = {
          id: this.editedExpense.id,
          title: formValue.title,
          amount: formValue.amount,
          date: formValue.date,
          category: formValue.category,
          description: formValue.description
        };
        
        this.expenseService.updateExpense(updateRequest).subscribe({
          next: (updatedExpense) => {
            this.dialogRef.close(updatedExpense);
          },
          error: (error) => {
            console.error('Error updating expense:', error);
          }
        });
      } else {
        const createRequest: ExpenseCreateRequest = {
          title: formValue.title,
          amount: formValue.amount,
          date: formValue.date,
          category: formValue.category,
          description: formValue.description
        };
        
        this.expenseService.createExpense(createRequest).subscribe({
          next: (newExpense) => {
            this.dialogRef.close(newExpense);
          },
          error: (error) => {
            console.error('Error creating expense:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 