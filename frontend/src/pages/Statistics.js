import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChartCard from '../components/ChartCard';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaSpinner } from 'react-icons/fa';
import { transactionService } from '../utils/api';

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
`;

const PageDescription = styled.p`
  color: #777;
  font-size: 1rem;
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DateInput = styled.input`
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ExportButton = styled.button`
  background-color: var(--white-color);
  color: var(--dark-color);
  border: 1px solid var(--grey-color);
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
    background-color: var(--light-grey);
    transform: translateY(-2px);
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  border-bottom: 1px solid var(--grey-color);
  padding-bottom: 1rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background-color: ${props => `var(--${props.color}-color)`};
  color: white;
  border-radius: var(--border-radius);
`;

const SummaryValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SummaryLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
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

const formatMoney = (amount) => {
  return amount.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const Statistics = () => {
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [chartData, setChartData] = useState({
    monthly: {
      labels: [],
      datasets: []
    },
    category: {
      labels: [],
      datasets: []
    },
    daily: {
      labels: [],
      datasets: []
    },
    savings: {
      labels: [],
      datasets: []
    }
  });
  const [analysis, setAnalysis] = useState({
    topCategory: '',
    topCategoryPercentage: 0,
    comparisonPercentage: 0,
    annualProjection: 0
  });

  // Pobieranie danych przy pierwszym renderowaniu i zmianie zakresu dat
  useEffect(() => {
    fetchStatisticsData();
  }, [dateRange.from, dateRange.to]);

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Równoległe pobieranie danych
      const [statsResponse, monthlyResponse, dailyStats] = await Promise.all([
        transactionService.getTransactionStats(dateRange.from, dateRange.to),
        transactionService.getMonthlyTransactionSummary(dateRange.from, dateRange.to),
        Promise.resolve({}) // W rzeczywistej aplikacji - pobranie statystyk dziennych z API
      ]);

      // Przetwarzanie danych podsumowania
      processStatsData(statsResponse);

      // Przetwarzanie danych do wykresów
      processChartData(monthlyResponse, statsResponse, dailyStats);

      // Analiza danych
      generateAnalysis(statsResponse, monthlyResponse);
    } catch (err) {
      console.error('Błąd podczas pobierania danych statystyk:', err);
      setError('Nie udało się pobrać danych statystycznych. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  // Przetwarzanie danych statystycznych
  const processStatsData = (statsData) => {
    // W API statsData to mapa kategorii -> kwota, gdzie "INCOME" to suma przychodów
    const income = statsData.INCOME || 0;
    
    // Suma wydatków - suma wszystkiego oprócz INCOME
    const expenses = Object.entries(statsData)
      .filter(([category]) => category !== 'INCOME')
      .reduce((sum, [, amount]) => sum + amount, 0);
    
    const balance = income - expenses;
    
    setSummaryData({
      income,
      expenses,
      balance
    });
  };

  // Przetwarzanie danych do wykresów
  const processChartData = (monthlyData, categoryData, dailyData) => {
    // Przygotowanie danych dla wykresu miesięcznego
    const monthNames = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 
      'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
      'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    
    // Konwersja danych miesięcznych (klucze to numery miesięcy)
    const months = Object.keys(monthlyData).sort((a, b) => Number(a) - Number(b));
    const monthlyLabels = months.map(month => monthNames[Number(month) - 1]);
    
    // Pobieranie wartości dla przychodów i wydatków
    // W prawdziwej aplikacji powinieneś otrzymać oddzielne dane dla przychodów i wydatków
    // Tutaj zakładamy, że monthlyData to mapa miesiąc -> saldo
    const monthlyValues = months.map(month => monthlyData[month]);
    
    // Tworzenie danych dla wykresu kategorii
    // Usuwanie kategorii INCOME z danych kategorii
    const categoryLabels = Object.keys(categoryData).filter(category => category !== 'INCOME');
    const categoryValues = categoryLabels.map(category => categoryData[category]);
    
    // Tłumaczenie nazw kategorii na polski
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
    
    // Kolory dla kategorii
    const categoryColors = [
      '#FFB74D', // Jedzenie
      '#64B5F6', // Transport
      '#9575CD', // Mieszkanie
      '#F06292', // Rozrywka
      '#81C784', // Zdrowie
      '#4DB6AC', // Zakupy
      '#FF8A65', // Wydatki osobiste
      '#4DD0E1', // Edukacja
      '#BA68C8', // Podróże
      '#A1887F', // Inne
    ];

    // Dane dzienne - w rzeczywistości powinny być pobierane z API
    // Tutaj tworzymy przykładowe dane dla demonstracji
    const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];
    const dayValues = [120.50, 85.30, 190.00, 45.80, 210.40, 310.20, 75.90];

    // Dane trendów oszczędności - tu również powinny być z API
    // Wykorzystujemy dane miesięczne jako demonstracyjne dane oszczędności
    const savingsData = monthlyValues.map(val => Math.max(0, val));
    
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
      },
      daily: {
        labels: dayLabels,
        datasets: [
          {
            label: 'Wydatki dzienne',
            data: dayValues,
            backgroundColor: 'rgba(67, 97, 238, 0.7)',
          }
        ]
      },
      savings: {
        labels: monthlyLabels,
        datasets: [
          {
            label: 'Oszczędności',
            data: savingsData,
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
          }
        ]
      }
    });
  };

  // Generowanie analizy na podstawie danych
  const generateAnalysis = (categoryData, monthlyData) => {
    // Znalezienie kategorii z największymi wydatkami
    const expenseCategories = Object.entries(categoryData)
      .filter(([category]) => category !== 'INCOME');
    
    if (expenseCategories.length === 0) {
      return;
    }
    
    // Sortowanie kategorii według kwoty wydatków (malejąco)
    const sortedCategories = [...expenseCategories].sort((a, b) => b[1] - a[1]);
    const totalExpenses = expenseCategories.reduce((sum, [, amount]) => sum + amount, 0);
    
    // Największa kategoria
    const [topCategory, topAmount] = sortedCategories[0];
    const topCategoryPercentage = totalExpenses > 0 ? Math.round((topAmount / totalExpenses) * 100) : 0;
    
    // Porównanie z poprzednim okresem - tutaj uproszczone
    // W rzeczywistej aplikacji dane powinny być pobierane z API
    const comparisonPercentage = -15; // Przykładowe dane
    
    // Projekcja roczna - uproszczona
    const monthsInData = Object.keys(monthlyData).length;
    const totalBalance = Object.values(monthlyData).reduce((sum, amount) => sum + amount, 0);
    const monthlyAverage = monthsInData > 0 ? totalBalance / monthsInData : 0;
    const annualProjection = monthlyAverage * 12;
    
    // Tłumaczenie nazwy kategorii
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
    
    setAnalysis({
      topCategory: categoryTranslations[topCategory] || topCategory,
      topCategoryPercentage,
      comparisonPercentage,
      annualProjection
    });
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    // W rzeczywistej aplikacji tu należałoby zaktualizować zakres dat
  };
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleExportStats = () => {
    alert('Funkcja eksportu statystyk zostanie zaimplementowana w przyszłości');
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <span>Ładowanie danych statystycznych...</span>
      </LoadingContainer>
    );
  }
  
  return (
    <>
      <PageHeader>
        <TitleSection>
          <PageTitle>Statystyki</PageTitle>
          <PageDescription>Analiza Twoich finansów w czasie</PageDescription>
        </TitleSection>
        
        <DateRangeContainer>
          <DateInput
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleDateChange}
          />
          <span>-</span>
          <DateInput
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleDateChange}
          />
          <ExportButton onClick={handleExportStats}>
            <FaDownload /> Eksport
          </ExportButton>
        </DateRangeContainer>
      </PageHeader>
      
      {error && <ErrorContainer>{error}</ErrorContainer>}
      
      <SummaryCard>
        <SummaryTitle>Podsumowanie okresu</SummaryTitle>
        <SummaryGrid>
          <SummaryItem color="success">
            <SummaryValue>{formatMoney(summaryData.income)}</SummaryValue>
            <SummaryLabel>Przychody</SummaryLabel>
          </SummaryItem>
          
          <SummaryItem color="danger">
            <SummaryValue>{formatMoney(summaryData.expenses)}</SummaryValue>
            <SummaryLabel>Wydatki</SummaryLabel>
          </SummaryItem>
          
          <SummaryItem color="primary">
            <SummaryValue>{formatMoney(summaryData.balance)}</SummaryValue>
            <SummaryLabel>Oszczędności</SummaryLabel>
          </SummaryItem>
        </SummaryGrid>
      </SummaryCard>
      
      <ChartsContainer>
        <ChartCard
          title="Saldo miesięczne"
          chartType="line"
          data={chartData.monthly}
          period={period}
          onPeriodChange={handlePeriodChange}
          info="Trend salda w wybranym okresie"
          icon={<FaChartLine />}
        />
        
        <ChartCard
          title="Struktura wydatków według kategorii"
          chartType="doughnut"
          data={chartData.category}
          info="Podział wydatków na kategorie"
          icon={<FaChartPie />}
        />
        
        <ChartCard
          title="Dzienne wydatki"
          chartType="bar"
          data={chartData.daily}
          info="Wydatki w rozbiciu na dni tygodnia"
          icon={<FaChartBar />}
        />
        
        <ChartCard
          title="Trend oszczędności"
          chartType="line"
          data={chartData.savings}
          period={period}
          onPeriodChange={handlePeriodChange}
          info="Trend oszczędności w wybranym okresie"
          icon={<FaChartLine />}
        />
      </ChartsContainer>
      
      <SummaryCard>
        <SummaryTitle>Analiza wydatków</SummaryTitle>
        <div>
          {analysis.topCategory && (
            <p>
              W analizowanym okresie największe wydatki poniosłeś w kategorii <strong>{analysis.topCategory}</strong> ({formatMoney(summaryData.expenses * analysis.topCategoryPercentage / 100)}), 
              co stanowi <strong>{analysis.topCategoryPercentage}%</strong> wszystkich wydatków.
            </p>
          )}
          {analysis.comparisonPercentage !== 0 && (
            <p>
              Twoje wydatki są <strong>o {Math.abs(analysis.comparisonPercentage)}% {analysis.comparisonPercentage < 0 ? 'niższe' : 'wyższe'}</strong> w porównaniu do poprzedniego miesiąca,
              głównie dzięki zmniejszeniu wydatków w kategoriach <strong>{analysis.topCategory}</strong> i <strong>Transport</strong>.
            </p>
          )}
          {analysis.annualProjection > 0 && (
            <p>
              Kontynuując obecny trend, możesz zaoszczędzić około <strong>{formatMoney(analysis.annualProjection)}</strong> rocznie.
            </p>
          )}
        </div>
      </SummaryCard>
    </>
  );
};

export default Statistics; 