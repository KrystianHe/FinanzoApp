import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { transactionService } from '../utils/api';

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
`;

const PageDescription = styled.p`
  color: #777;
  font-size: 1rem;
`;

const FormContainer = styled.div`
  background-color: var(--white-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--white-color);
  color: var(--dark-color);
  border: 1px solid var(--grey-color);
  
  &:hover {
    background-color: var(--light-grey);
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey-color);
    cursor: not-allowed;
    transform: none;
  }
`;

const FormError = styled.div`
  color: var(--danger-color);
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background-color: var(--success-light);
  color: var(--success-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-light);
  color: var(--danger-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AddTransaction = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    category: '',
    type: 'EXPENSE',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const categories = {
    INCOME: ['SALARY', 'BUSINESS', 'GIFT', 'INTEREST', 'OTHER'],
    EXPENSE: ['FOOD', 'TRANSPORT', 'HOUSING', 'ENTERTAINMENT', 'HEALTH', 'SHOPPING', 'PERSONAL', 'EDUCATION', 'TRAVEL', 'OTHER']
  };
  
  const categoryTranslations = {
    // Kategorie przychodów
    'SALARY': 'Wynagrodzenie',
    'BUSINESS': 'Działalność gospodarcza',
    'GIFT': 'Prezent/darowizna',
    'INTEREST': 'Odsetki/zyski',
    'OTHER_INCOME': 'Inne przychody',
    
    // Kategorie wydatków
    'FOOD': 'Jedzenie',
    'TRANSPORT': 'Transport',
    'HOUSING': 'Mieszkanie',
    'ENTERTAINMENT': 'Rozrywka',
    'HEALTH': 'Zdrowie',
    'SHOPPING': 'Zakupy',
    'PERSONAL': 'Wydatki osobiste',
    'EDUCATION': 'Edukacja',
    'TRAVEL': 'Podróże',
    'OTHER': 'Inne'
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type' && value !== formData.type) {
      // Reset category when changing transaction type
      setFormData({
        ...formData,
        [name]: value,
        category: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.date) {
      errors.date = 'Data jest wymagana';
    }
    
    if (!formData.amount) {
      errors.amount = 'Kwota jest wymagana';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Kwota musi być liczbą większą od 0';
    }
    
    if (!formData.description) {
      errors.description = 'Opis jest wymagany';
    }
    
    if (!formData.category) {
      errors.category = 'Kategoria jest wymagana';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetowanie statusów
    setSuccess(false);
    setError(null);
    
    // Validacja formularza
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Przygotowanie danych transakcji
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };
      
      // Wywołanie API
      await transactionService.addTransaction(transactionData);
      
      // Obsługa sukcesu
      setSuccess(true);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category: '',
        type: 'EXPENSE',
        notes: ''
      });
      
      // Przekierowanie po 2 sekundach
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (err) {
      console.error('Błąd podczas dodawania transakcji:', err);
      setError('Wystąpił błąd podczas dodawania transakcji. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <>
      <PageHeader>
        <PageTitle>Dodaj transakcję</PageTitle>
        <PageDescription>Uzupełnij poniższy formularz, aby dodać nową transakcję</PageDescription>
      </PageHeader>
      
      <FormContainer>
        {success && (
          <SuccessMessage>
            Transakcja została pomyślnie dodana!
          </SuccessMessage>
        )}
        
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="date">Data transakcji</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
            {formErrors.date && <FormError>{formErrors.date}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="type">Typ transakcji</Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="EXPENSE">Wydatek</option>
              <option value="INCOME">Przychód</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="amount">Kwota (PLN)</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              placeholder="0.00"
            />
            {formErrors.amount && <FormError>{formErrors.amount}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Opis transakcji</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Np. Zakupy spożywcze w Lidlu"
            />
            {formErrors.description && <FormError>{formErrors.description}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="category">Kategoria</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Wybierz kategorię</option>
              {categories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {categoryTranslations[category] || category}
                </option>
              ))}
            </Select>
            {formErrors.category && <FormError>{formErrors.category}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="notes">Notatki (opcjonalnie)</Label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Dodatkowe informacje o transakcji..."
            />
          </FormGroup>
          
          <ButtonContainer>
            <CancelButton type="button" onClick={handleCancel}>
              <FaTimes /> Anuluj
            </CancelButton>
            <SaveButton type="submit" disabled={loading}>
              {loading ? <LoadingSpinner /> : <FaSave />} Zapisz
            </SaveButton>
          </ButtonContainer>
        </form>
      </FormContainer>
    </>
  );
};

export default AddTransaction; 