import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSpinner, FaSignInAlt } from 'react-icons/fa';
import { authService } from '../utils/api';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--light-grey);
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 550px;
  padding: 2.5rem;
  
  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-color);
    opacity: 0.7;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: border-color 0.3s ease;
  
  &:focus-within {
    border-color: var(--primary-color);
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
  font-size: 0.9rem;
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: var(--dark-color);
  opacity: 0.5;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey-color);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-light);
  color: var(--danger-color);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background-color: var(--success-light);
  color: var(--success-color);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const RedirectLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ValidationMessage = styled.p`
  color: ${props => props.error ? 'var(--danger-color)' : 'var(--grey-color)'};
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validation, setValidation] = useState({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    dateOfBirth: true
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Resetowanie błędów walidacji przy edycji
    setValidation({
      ...validation,
      [name]: true
    });
  };
  
  const validateForm = () => {
    const newValidation = {
      firstName: formData.firstName.trim() !== '',
      lastName: formData.lastName.trim() !== '',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: formData.password.length >= 8,
      confirmPassword: formData.password === formData.confirmPassword,
      dateOfBirth: formData.dateOfBirth !== ''
    };
    
    setValidation(newValidation);
    
    return Object.values(newValidation).every(isValid => isValid);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Formularz zawiera błędy. Popraw je przed kontynuowaniem.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth
      });
      
      setSuccess(response.message);
      
      // Zapisanie emaila do localStorage do użycia na stronie weryfikacji
      localStorage.setItem('verificationEmail', formData.email);
      
      // Resetowanie formularza
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
      });
      
      // Przekierowanie do strony weryfikacji
      setTimeout(() => {
        navigate('/verify');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <h1>MojeWydatki</h1>
          <p>Zarządzaj swoimi finansami</p>
        </Logo>
        
        <FormTitle>Zarejestruj się</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <form onSubmit={handleSubmit}>
          <InputRow>
            <FormGroup>
              <InputLabel htmlFor="firstName">Imię</InputLabel>
              <InputGroup>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Twoje imię"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </InputGroup>
              {!validation.firstName && (
                <ValidationMessage error>Imię jest wymagane</ValidationMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="lastName">Nazwisko</InputLabel>
              <InputGroup>
                <InputIcon>
                  <FaUser />
                </InputIcon>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Twoje nazwisko"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </InputGroup>
              {!validation.lastName && (
                <ValidationMessage error>Nazwisko jest wymagane</ValidationMessage>
              )}
            </FormGroup>
          </InputRow>
          
          <FormGroup>
            <InputLabel htmlFor="email">Adres email</InputLabel>
            <InputGroup>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="twoj@email.pl"
                value={formData.email}
                onChange={handleChange}
              />
            </InputGroup>
            {!validation.email && (
              <ValidationMessage error>Podaj poprawny adres email</ValidationMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <InputLabel htmlFor="dateOfBirth">Data urodzenia</InputLabel>
            <InputGroup>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </InputGroup>
            {!validation.dateOfBirth && (
              <ValidationMessage error>Data urodzenia jest wymagana</ValidationMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <InputLabel htmlFor="password">Hasło</InputLabel>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Minimum 8 znaków"
                value={formData.password}
                onChange={handleChange}
              />
            </InputGroup>
            {!validation.password && (
              <ValidationMessage error>Hasło musi mieć co najmniej 8 znaków</ValidationMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <InputLabel htmlFor="confirmPassword">Powtórz hasło</InputLabel>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </InputGroup>
            {!validation.confirmPassword && (
              <ValidationMessage error>Hasła nie są identyczne</ValidationMessage>
            )}
          </FormGroup>
          
          <Button type="submit" disabled={loading || success}>
            {loading ? <LoadingSpinner /> : <FaUserPlus />} Zarejestruj się
          </Button>
        </form>
        
        <RedirectLink>
          Masz już konto? <Link to="/login"><FaSignInAlt /> Zaloguj się</Link>
        </RedirectLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register; 