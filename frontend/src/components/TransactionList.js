import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const ListContainer = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ListHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--grey-color);
`;

const ListTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border: 1px solid var(--grey-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
  
  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #777;
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--light-grey);
  
  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--dark-color);
    border-bottom: 1px solid var(--grey-color);
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--grey-color);
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 5px;
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--grey-color);
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--light-grey);
    }
  }
  
  td {
    padding: 1rem;
    
    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0.5rem 1rem;
      
      &:before {
        content: attr(data-label);
        font-weight: 600;
        color: var(--dark-color);
      }
    }
  }
  
  @media (max-width: 768px) {
    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid var(--grey-color);
      border-radius: var(--border-radius);
    }
  }
`;

const Amount = styled.span`
  font-weight: 600;
  color: ${props => props.type === 'income' ? 'var(--success-color)' : 'var(--danger-color)'};
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  background-color: ${props => {
    switch(props.category) {
      case 'food': return '#FFE0B2';
      case 'transport': return '#B3E5FC';
      case 'entertainment': return '#E1BEE7';
      case 'housing': return '#C5CAE9';
      case 'utilities': return '#B2DFDB';
      case 'health': return '#F8BBD0';
      case 'shopping': return '#DCEDC8';
      case 'personal': return '#F5F5F5';
      case 'education': return '#BBDEFB';
      case 'travel': return '#D7CCC8';
      case 'income': return '#C8E6C9';
      default: return '#CFD8DC';
    }
  }};
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  
  &:hover {
    background-color: ${props => props.delete ? 'var(--danger-color)' : 'var(--primary-color)'};
    color: white;
  }
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #777;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--grey-color);
`;

const PageInfo = styled.div`
  color: #777;
  font-size: 0.9rem;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.8rem;
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--grey-color)'};
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--dark-color)'};
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? 'var(--primary-light)' : 'var(--light-grey)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const getCategoryName = (categoryId) => {
  const categories = {
    'food': 'Jedzenie',
    'transport': 'Transport',
    'entertainment': 'Rozrywka',
    'housing': 'Mieszkanie',
    'utilities': 'Rachunki',
    'health': 'Zdrowie',
    'shopping': 'Zakupy',
    'personal': 'Wydatki osobiste',
    'education': 'Edukacja',
    'travel': 'Podróże',
    'income': 'Przychód',
    'other': 'Inne'
  };
  
  return categories[categoryId] || categoryId;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL');
};

const formatAmount = (amount) => {
  return amount.toLocaleString('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  });
};

const TransactionList = ({ transactions = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filtrowanie transakcji
  const filteredTransactions = transactions.filter(transaction => {
    // Filtrowanie według wyszukiwanego tekstu
    const searchMatch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrowanie według typu transakcji
    const filterMatch = filter === 'all' || transaction.type === filter;
    
    return searchMatch && filterMatch;
  });
  
  // Sortowanie transakcji
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Paginacja
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return (
      <SortIcon>
        {sortDirection === 'asc' ? <FaChevronUp /> : <FaChevronDown />}
      </SortIcon>
    );
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Lista transakcji</ListTitle>
        
        <SearchContainer>
          <SearchInput>
            <FaSearch />
            <input
              type="text"
              placeholder="Szukaj transakcji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          
          <FilterSelect
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="expense">Wydatki</option>
            <option value="income">Przychody</option>
          </FilterSelect>
        </SearchContainer>
      </ListHeader>
      
      {filteredTransactions.length === 0 ? (
        <EmptyMessage>
          Nie znaleziono transakcji pasujących do podanych kryteriów.
        </EmptyMessage>
      ) : (
        <>
          <Table>
            <TableHeader>
              <tr>
                <th onClick={() => handleSort('title')}>
                  Nazwa {renderSortIcon('title')}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Kwota {renderSortIcon('amount')}
                </th>
                <th onClick={() => handleSort('date')}>
                  Data {renderSortIcon('date')}
                </th>
                <th onClick={() => handleSort('category')}>
                  Kategoria {renderSortIcon('category')}
                </th>
                <th>Akcje</th>
              </tr>
            </TableHeader>
            
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td data-label="Nazwa">{transaction.title}</td>
                  <td data-label="Kwota">
                    <Amount type={transaction.type}>
                      {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
                    </Amount>
                  </td>
                  <td data-label="Data">{formatDate(transaction.date)}</td>
                  <td data-label="Kategoria">
                    <Category category={transaction.category}>
                      {getCategoryName(transaction.category)}
                    </Category>
                  </td>
                  <td data-label="Akcje">
                    <ActionButtons>
                      <ActionButton onClick={() => onEdit(transaction)}>
                        <FaEdit />
                      </ActionButton>
                      <ActionButton delete onClick={() => onDelete(transaction.id)}>
                        <FaTrashAlt />
                      </ActionButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination>
              <PageInfo>
                Pokazuje {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedTransactions.length)} z {sortedTransactions.length} transakcji
              </PageInfo>
              
              <PageButtons>
                <PageButton 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Poprzednia
                </PageButton>
                
                {[...Array(totalPages).keys()].map(page => (
                  <PageButton
                    key={page + 1}
                    active={currentPage === page + 1}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </PageButton>
                ))}
                
                <PageButton
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Następna
                </PageButton>
              </PageButtons>
            </Pagination>
          )}
        </>
      )}
    </ListContainer>
  );
};

export default TransactionList; 