import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSave, FaTimes } from 'react-icons/fa';

const FormContainer = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  border-bottom: 1px solid var(--grey-color);
  padding-bottom: 1rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  grid-column: span 2;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
`;

const SaveButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--light-grey);
  color: var(--dark-color);
  
  &:hover {
    background-color: var(--grey-color);
  }
`;

const ErrorMessage = styled.p`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const TransactionForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    amount: initialData.amount || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    category: initialData.category || '',
    type: initialData.type || 'expense',
    description: initialData.description || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const categories = [
    { id: 'food', name: 'Jedzenie' },
    { id: 'transport', name: 'Transport' },
    { id: 'entertainment', name: 'Rozrywka' },
    { id: 'housing', name: 'Mieszkanie' },
    { id: 'utilities', name: 'Rachunki' },
    { id: 'health', name: 'Zdrowie' },
    { id: 'shopping', name: 'Zakupy' },
    { id: 'personal', name: 'Wydatki osobiste' },
    { id: 'education', name: 'Edukacja' },
    { id: 'travel', name: 'Podróże' },
    { id: 'income', name: 'Przychód' },
    { id: 'other', name: 'Inne' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Nazwa transakcji jest wymagana';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Kwota jest wymagana';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Kwota musi być liczbą większą od 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Data jest wymagana';
    }
    
    if (!formData.category) {
      newErrors.category = 'Kategoria jest wymagana';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>
        {initialData.id ? 'Edytuj transakcję' : 'Dodaj nową transakcję'}
      </FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <InputLabel htmlFor="title">Nazwa transakcji</InputLabel>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Np. Zakupy spożywcze"
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <InputLabel htmlFor="amount">Kwota (PLN)</InputLabel>
          <Input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <InputLabel htmlFor="date">Data</InputLabel>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <InputLabel htmlFor="category">Kategoria</InputLabel>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <InputLabel htmlFor="type">Typ transakcji</InputLabel>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="expense">Wydatek</option>
            <option value="income">Przychód</option>
          </Select>
        </FormGroup>
        
        <FormGroup style={{ gridColumn: 'span 2' }}>
          <InputLabel htmlFor="description">Opis (opcjonalnie)</InputLabel>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Dodatkowe informacje o transakcji..."
          />
        </FormGroup>
        
        <ButtonGroup>
          {onCancel && (
            <CancelButton type="button" onClick={onCancel}>
              <FaTimes /> Anuluj
            </CancelButton>
          )}
          
          <SaveButton type="submit">
            <FaSave /> Zapisz
          </SaveButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default TransactionForm; 