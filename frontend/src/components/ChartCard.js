import React from 'react';
import styled from 'styled-components';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CardContainer = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
  height: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--grey-color);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: var(--dark-color);
`;

const PeriodSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const ChartInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #777;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px dashed var(--grey-color);
`;

const ChartLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const NoDataMessage = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-style: italic;
`;

const LINE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value} zł`
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    }
  }
};

const BAR_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value} zł`
      }
    }
  }
};

const PIE_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

const ChartCard = ({
  title,
  chartType = 'line',
  data,
  period = 'month',
  onPeriodChange,
  showLegend = true,
  info,
  height = 300
}) => {
  const renderChart = () => {
    if (!data || (data.datasets && data.datasets.length === 0) || (data.labels && data.labels.length === 0)) {
      return <NoDataMessage>Brak danych do wyświetlenia</NoDataMessage>;
    }

    const chartProps = {
      data,
      options: chartType === 'line' ? LINE_CHART_OPTIONS : 
               chartType === 'bar' ? BAR_CHART_OPTIONS : 
               PIE_CHART_OPTIONS,
      height
    };

    switch (chartType) {
      case 'line':
        return <Line {...chartProps} />;
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      default:
        return <Line {...chartProps} />;
    }
  };

  const renderLegend = () => {
    if (!showLegend || !data || !data.datasets) return null;

    return (
      <ChartLegend>
        {data.datasets.map((dataset, index) => (
          <LegendItem key={index}>
            <LegendColor color={dataset.backgroundColor || dataset.borderColor} />
            <span>{dataset.label}</span>
          </LegendItem>
        ))}
      </ChartLegend>
    );
  };

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        
        {onPeriodChange && (
          <PeriodSelect value={period} onChange={(e) => onPeriodChange(e.target.value)}>
            <option value="week">Tydzień</option>
            <option value="month">Miesiąc</option>
            <option value="quarter">Kwartał</option>
            <option value="year">Rok</option>
          </PeriodSelect>
        )}
      </CardHeader>
      
      <ChartContainer>
        {renderChart()}
      </ChartContainer>
      
      {renderLegend()}
      
      {info && <ChartInfo>{info}</ChartInfo>}
    </CardContainer>
  );
};

export default ChartCard; 