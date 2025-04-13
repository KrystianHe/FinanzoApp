import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWallet, FaArrowUp, FaArrowDown, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import SummaryCard from '../components/SummaryCard';
import ChartCard from '../components/ChartCard';
import TransactionList from '../components/TransactionList';
import { transactionService, transactionMapper } from '../utils/api';
import { useNavigate } from 'react-router-dom';

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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const WelcomeMessage = styled.div`
  background-color: var(--primary-color);
  color: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
`;

const WelcomeTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const WelcomeButton = styled.button`
  background-color: white;
  color: var(--primary-color);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--primary-color);
  gap: 1rem;
`;

const ErrorContainer = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  text-align: center;
`;

const Dashboard = () => {
  const [period, setPeriod] = useState('month');
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    balance: 0,
    balanceChange: 0,
    income: 0,
    incomeChange: 0,
    expenses: 0,
    expensesChange: 0,
    transactions: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    monthly: {
      labels: [],
      datasets: []
    },
    category: {
      labels: [],
      datasets: []
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      const [transactionsResponse, statsResponse, monthlyResponse] = await Promise.all([
        transactionService.getTransactionsByDateRange(startDateString, endDateString),
        transactionService.getTransactionStats(startDateString, endDateString),
        transactionService.getMonthlyTransactionSummary(
          new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1).toISOString().split('T')[0],
          endDateString
        )
      ]);

      const mappedTransactions = transactionMapper.mapTransactionList(transactionsResponse);
      setTransactions(mappedTransactions);

      processStatsData(statsResponse, mappedTransactions.length);
      processChartData(monthlyResponse, statsResponse);
    } catch (err) {
      console.error('Błąd podczas pobierania danych pulpitu:', err);
      setError('Nie udało się pobrać danych. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  const processStatsData = (statsData, transactionsCount) => {
    const income = statsData.INCOME || 0;
    
    const expenses = Object.entries(statsData)
      .filter(([category]) => category !== 'INCOME')
      .reduce((sum, [, amount]) => sum + amount, 0);
    
    const balance = income - expenses;
    
    setSummaryData({
      balance,
      balanceChange: 0,
      income,
      incomeChange: 0,
      expenses,
      expensesChange: 0,
      transactions: transactionsCount
    });
  };

  const processChartData = (monthlyData, categoryData) => {
    const monthNames = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 
      'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
      'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    
    const months = Object.keys(monthlyData).sort((a, b) => Number(a) - Number(b));
    const monthlyLabels = months.map(month => monthNames[Number(month) - 1]);
    
    const monthlyValues = months.map(month => monthlyData[month]);
    
    const categoryLabels = Object.keys(categoryData).filter(category => category !== 'INCOME');
    const categoryValues = categoryLabels.map(category => categoryData[category]);
    
    const categoryTranslations = {
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
    
    const translatedCategoryLabels = categoryLabels.map(category => 
      categoryTranslations[category] || category
    );
    
    const categoryColors = [
      '#FFB74D',
      '#64B5F6',
      '#9575CD',
      '#F06292',
      '#81C784',
      '#4DB6AC',
      '#FF8A65',
      '#4DD0E1',
      '#BA68C8',
      '#A1887F',
    ];
    
    setChartData({
      monthly: {
        labels: monthlyLabels,
        datasets: [
          {
            label: 'Saldo miesięczne',
            data: monthlyValues,
            borderColor: 'rgba(67, 97, 238, 1)',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            fill: true,
          }
        ]
      },
      category: {
        labels: translatedCategoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: categoryColors.slice(0, categoryLabels.length),
            borderWidth: 1,
          }
        ]
      }
    });
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  const handleEditTransaction = (transaction) => {
    navigate(`/transactions/edit/${transaction.id}`, { state: { transaction } });
  };
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
      try {
        setLoading(true);
        await transactionService.deleteTransaction(id);
        fetchDashboardData();
      } catch (err) {
        console.error(`Błąd podczas usuwania transakcji o ID ${id}:`, err);
        setError('Nie udało się usunąć transakcji. Spróbuj ponownie później.');
        setLoading(false);
      }
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <span>Ładowanie danych pulpitu...</span>
      </LoadingContainer>
    );
  }
  
  return (
    <>
      <PageHeader>
        <PageTitle>Pulpit</PageTitle>
        <PageDescription>Przegląd Twoich finansów na pierwszy rzut oka</PageDescription>
      </PageHeader>
      
      {error && <ErrorContainer>{error}</ErrorContainer>}
      
      {showWelcome && (
        <WelcomeMessage>
          <WelcomeTitle>Witaj w aplikacji MojeWydatki! 👋</WelcomeTitle>
          <WelcomeText>
            Śledzenie wydatków nigdy nie było tak proste. Zacznij dodawać swoje transakcje, 
            aby uzyskać pełny obraz swoich finansów.
          </WelcomeText>
          <WelcomeButton onClick={() => setShowWelcome(false)}>
            Zacznij teraz
          </WelcomeButton>
        </WelcomeMessage>
      )}
      
      <CardGrid>
        <SummaryCard
          title="Saldo bieżące"
          value={`${summaryData.balance.toLocaleString('pl-PL')} zł`}
          icon={<FaWallet />}
          colorType="primary"
          percentageChange={summaryData.balanceChange}
          info="Różnica w porównaniu do poprzedniego miesiąca"
        />
        
        <SummaryCard
          title="Miesięczne przychody"
          value={`${summaryData.income.toLocaleString('pl-PL')} zł`}
          icon={<FaArrowUp />}
          colorType="success"
          percentageChange={summaryData.incomeChange}
          info="Różnica w porównaniu do poprzedniego miesiąca"
        />
        
        <SummaryCard
          title="Miesięczne wydatki"
          value={`${summaryData.expenses.toLocaleString('pl-PL')} zł`}
          icon={<FaArrowDown />}
          colorType="danger"
          percentageChange={summaryData.expensesChange}
          info="Różnica w porównaniu do poprzedniego miesiąca"
        />
        
        <SummaryCard
          title="Liczba transakcji"
          value={summaryData.transactions}
          icon={<FaCalendarAlt />}
          colorType="info"
          info="W bieżącym miesiącu"
        />
      </CardGrid>
      
      <ChartGrid>
        <ChartCard
          title="Saldo miesięczne"
          chartType="line"
          data={chartData.monthly}
          period={period}
          onPeriodChange={handlePeriodChange}
          info="Zmiana salda w czasie"
        />
        
        <ChartCard
          title="Struktura wydatków"
          chartType="doughnut"
          data={chartData.category}
          info="Podział wydatków według kategorii"
        />
      </ChartGrid>
      
      <TransactionList
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </>
  );
};

export default Dashboard; 