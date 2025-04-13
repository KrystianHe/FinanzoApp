import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => `var(--${props.colorType}-color)`};
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  color: var(--dark-color);
  margin-bottom: 0.8rem;
  font-weight: 500;
`;

const CardValue = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const CardPercentage = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.isPositive ? 'var(--success-color)' : 'var(--danger-color)'};
  gap: 5px;
`;

const CardInfo = styled.p`
  font-size: 0.85rem;
  color: #777;
  margin-top: 0.5rem;
`;

const SummaryCard = ({ 
  title, 
  value, 
  icon, 
  colorType = 'primary', 
  percentageChange, 
  info 
}) => {
  const isPositive = percentageChange >= 0;
  
  return (
    <CardContainer>
      <CardIcon colorType={colorType}>
        {icon}
      </CardIcon>
      <CardTitle>{title}</CardTitle>
      <CardValue>{value}</CardValue>
      
      {percentageChange !== undefined && (
        <CardPercentage isPositive={isPositive}>
          {isPositive ? '↑' : '↓'} {Math.abs(percentageChange)}%
        </CardPercentage>
      )}
      
      {info && <CardInfo>{info}</CardInfo>}
    </CardContainer>
  );
};

export default SummaryCard; 