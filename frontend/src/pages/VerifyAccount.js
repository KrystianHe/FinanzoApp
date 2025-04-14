import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import styled from 'styled-components';
import { FaSpinner, FaCheckCircle, FaEnvelope, FaUndo } from 'react-icons/fa';

const VerifyAccountContainer = styled.div`
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
`;

const Subtitle = styled.p`
  text-align: center;
  color: var(--dark-grey);
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const VerificationCodeInput = styled.input`
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 0.5rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
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

const ResendCodeButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: underline;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const EmailBox = styled.div`
  background-color: var(--light-grey);
  padding: 1rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  
  useEffect(() => {
    // Pobierz email z localStorage
    const storedEmail = localStorage.getItem('verificationEmail');
    if (!storedEmail) {
      navigate('/register');
      return;
    }
    
    setEmail(storedEmail);
  }, [navigate]);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Wprowadź poprawny 6-cyfrowy kod weryfikacyjny.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.verifyCode({
        email,
        code: verificationCode
      });
      
      setSuccess(response.message);
      
      localStorage.removeItem('verificationEmail');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Nieprawidłowy kod weryfikacyjny. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setError('');
      
      const response = await authService.resendCode(email);
      setSuccess(response.message);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się wysłać nowego kodu. Spróbuj ponownie.');
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <VerifyAccountContainer>
      <Title>Weryfikacja konta</Title>
      <Subtitle>
        Na Twój adres email został wysłany kod weryfikacyjny. 
        Wprowadź go poniżej, aby aktywować konto.
      </Subtitle>
      
      <EmailBox>
        <FaEnvelope />
        {email}
      </EmailBox>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && (
        <SuccessMessage>
          <FaCheckCircle />
          {success}
        </SuccessMessage>
      )}
      
      <Form onSubmit={handleVerify}>
        <VerificationCodeInput 
          type="text"
          placeholder="______"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
          autoFocus
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner /> : 'Zweryfikuj konto'}
        </Button>
      </Form>
      
      <ResendCodeButton 
        onClick={handleResendCode} 
        disabled={resendLoading}
      >
        {resendLoading ? <LoadingSpinner size={12} /> : <FaUndo size={12} />}
        Wyślij kod ponownie
      </ResendCodeButton>
    </VerifyAccountContainer>
  );
};

export default VerifyAccount; 