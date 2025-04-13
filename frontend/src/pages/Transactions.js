import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaPlus, FaSearch, FaFilter, FaSpinner, FaFileDownload, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { transactionService } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PageTitleContainer = styled.div``;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
`;

const PageDescription = styled.p`
  color: #777;
  font-size: 1rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const ExportButton = styled.button`
  background-color: var(--white-color);
  color: var(--dark-color);
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--grey-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--light-grey);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const FiltersContainer = styled.div`
  background-color: var(--white-color);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchContainer = styled.div`
  flex: 2;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 0.8rem;
  transform: translateY(-50%);
  color: #aaa;
`;

const FilterGroup = styled.div`
  flex: 1;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: var(--dark-color);
  white-space: nowrap;
  
  @media (max-width: 768px) {
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const FilterSelect = styled.select`
  flex: 1;
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

const DateRangeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 2;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const DateSeparator = styled.span`
  color: var(--dark-color);
`;

const TransactionsContainer = styled.div`
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
`;

const TransactionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--light-grey);
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--dark-color);
  border-bottom: 1px solid var(--grey-color);
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--grey-color);
  
  &:hover {
    background-color: var(--light-grey);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--dark-color);
`;

const AmountCell = styled(TableCell)`
  font-weight: 600;
  white-space: nowrap;
  color: ${({ type }) => type === 'EXPENSE' ? 'var(--danger-color)' : 'var(--success-color)'};
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: var(--light-grey);
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ActionsCell = styled(TableCell)`
  text-align: right;
  white-space: nowrap;
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  color: var(--dark-color);
  opacity: 0.6;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const DeleteIcon = styled(ActionIcon)`
  &:hover {
    color: var(--danger-color);
  }
`;

const EditIcon = styled(ActionIcon)`
  &:hover {
    color: var(--primary-color);
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: #777;
`;

const EmptyStateText = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const EmptyStateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--light-grey);
  border-top: 1px solid var(--grey-color);
`;

const PageInfo = styled.div`
  color: var(--dark-color);
  font-size: 0.9rem;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => active ? 'var(--primary-color)' : 'white'};
  color: ${({ active }) => active ? 'white' : 'var(--dark-color)'};
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${({ active }) => active ? 'var(--primary-dark)' : 'var(--light-grey)'};
  }
`;

const LoadingContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled(FaSpinner)`
  font-size: 2rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

const SuccessMessage = styled.div`
  background-color: var(--success-light);
  color: var(--success-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-light);
  color: var(--danger-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem;
`;

const DeleteConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
`;

const DialogTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
`;

const DialogDescription = styled.p`
  margin-bottom: 2rem;
  color: #777;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background-color: var(--white-color);
  color: var(--dark-color);
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--grey-color);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--light-grey);
  }
`;

const DeleteButton = styled.button`
  background-color: var(--danger-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`;

const categoryTranslations = {
  // Kategorie przychodów
  'SALARY': 'Wynagrodzenie',
  'BUSINESS': 'Działalność gospodarcza',
  'GIFT': 'Prezent/darowizna',
  'INTEREST': 'Odsetki/zyski',
  'OTHER': 'Inne',
  
  // Kategorie wydatków
  'FOOD': 'Jedzenie',
  'TRANSPORT': 'Transport',
  'HOUSING': 'Mieszkanie',
  'ENTERTAINMENT': 'Rozrywka',
  'HEALTH': 'Zdrowie',
  'SHOPPING': 'Zakupy',
  'PERSONAL': 'Wydatki osobiste',
  'EDUCATION': 'Edukacja',
  'TRAVEL': 'Podróże'
};

const typeTranslations = {
  'INCOME': 'Przychód',
  'EXPENSE': 'Wydatek'
};

const Transactions = () => {
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.success || null);
  
  // Filtry i paginacja
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });
  
  // Stan dialogu usuwania
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  
  // Pobieranie transakcji
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      let params = {
        page: pagination.page - 1,
        size: pagination.size,
        sort: 'date,desc'
      };

      if (filters.search) params.search = filters.search;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.type && filters.type !== 'ALL') params.type = filters.type;
      if (filters.category && filters.category !== 'ALL') params.category = filters.category;

      const response = await transactionService.getTransactions(params);
      
      setTransactions(response.content || []);
      setPagination({
        ...pagination,
        totalPages: response.totalPages || 1,
        totalElements: response.totalElements || 0
      });
      
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Nie udało się pobrać listy transakcji. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };
  
  // Pobieranie transakcji przy pierwszym renderowaniu
  useEffect(() => {
    fetchTransactions();
    
    // Czyszczenie komunikatu sukcesu po 3 sekundach
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Pobieranie transakcji po zmianie filtrów lub paginacji
  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.size, filters]);
  
  // Obsługa zmiany filtrów
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Resetowanie strony przy zmianie filtrów
    setPagination({
      ...pagination,
      page: 0
    });
  };
  
  // Obsługa zmiany strony
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };
  
  // Obsługa eksportu danych
  const handleExport = async () => {
    try {
      await transactionService.exportTransactions();
      setSuccessMessage('Dane zostały wyeksportowane pomyślnie.');
    } catch (err) {
      console.error('Błąd podczas eksportu danych:', err);
      setError('Nie udało się wyeksportować danych. Spróbuj ponownie później.');
    }
  };
  
  // Obsługa usuwania transakcji
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      setSuccessMessage('Transakcja została usunięta pomyślnie.');
      
      // Odświeżenie listy transakcji
      fetchTransactions();
    } catch (err) {
      console.error('Błąd podczas usuwania transakcji:', err);
      setError('Nie udało się usunąć transakcji. Spróbuj ponownie później.');
      setDeleteDialogOpen(false);
    }
  };
  
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };
  
  return (
    <>
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Transakcje</PageTitle>
          <PageDescription>Zarządzaj swoimi transakcjami</PageDescription>
        </PageTitleContainer>
        
        <ActionsContainer>
          <ExportButton onClick={handleExport}>
            <FaFileDownload /> Eksportuj
          </ExportButton>
          <ActionButton to="/transactions/add">
            <FaPlus /> Dodaj
          </ActionButton>
        </ActionsContainer>
      </PageHeader>
      
      {successMessage && (
        <SuccessMessage>
          {successMessage}
          <CloseButton onClick={() => setSuccessMessage(null)}>×</CloseButton>
        </SuccessMessage>
      )}
      
      {error && (
        <ErrorMessage>
          {error}
          <CloseButton onClick={() => setError(null)}>×</CloseButton>
        </ErrorMessage>
      )}
      
      <FiltersContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Szukaj transakcji..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </SearchContainer>
        
        <FilterGroup>
          <FilterLabel>Typ:</FilterLabel>
          <FilterSelect 
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">Wszystkie</option>
            <option value="EXPENSE">Wydatki</option>
            <option value="INCOME">Przychody</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Kategoria:</FilterLabel>
          <FilterSelect 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Wszystkie</option>
            <option disabled>--- Przychody ---</option>
            <option value="SALARY">Wynagrodzenie</option>
            <option value="BUSINESS">Działalność gospodarcza</option>
            <option value="GIFT">Prezent/darowizna</option>
            <option value="INTEREST">Odsetki/zyski</option>
            <option value="OTHER_INCOME">Inne przychody</option>
            <option disabled>--- Wydatki ---</option>
            <option value="FOOD">Jedzenie</option>
            <option value="TRANSPORT">Transport</option>
            <option value="HOUSING">Mieszkanie</option>
            <option value="ENTERTAINMENT">Rozrywka</option>
            <option value="HEALTH">Zdrowie</option>
            <option value="SHOPPING">Zakupy</option>
            <option value="PERSONAL">Wydatki osobiste</option>
            <option value="EDUCATION">Edukacja</option>
            <option value="TRAVEL">Podróże</option>
            <option value="OTHER">Inne</option>
          </FilterSelect>
        </FilterGroup>
        
        <DateRangeContainer>
          <FilterLabel>Okres:</FilterLabel>
          <DateInput 
            type="date" 
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
          <DateSeparator>do</DateSeparator>
          <DateInput 
            type="date" 
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </DateRangeContainer>
      </FiltersContainer>
      
      <TransactionsContainer>
        {loading ? (
          <LoadingContainer>
            <Spinner />
            <p>Ładowanie transakcji...</p>
          </LoadingContainer>
        ) : transactions.length === 0 ? (
          <EmptyState>
            <EmptyStateText>Brak transakcji spełniających podane kryteria.</EmptyStateText>
            <EmptyStateButton to="/transactions/add">
              <FaPlus /> Dodaj pierwszą transakcję
            </EmptyStateButton>
          </EmptyState>
        ) : (
          <>
            <TransactionsTable>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Data</TableHeaderCell>
                  <TableHeaderCell>Opis</TableHeaderCell>
                  <TableHeaderCell>Kategoria</TableHeaderCell>
                  <TableHeaderCell>Typ</TableHeaderCell>
                  <TableHeaderCell>Kwota (PLN)</TableHeaderCell>
                  <TableHeaderCell>Akcje</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <CategoryBadge>
                        {categoryTranslations[transaction.category] || transaction.category}
                      </CategoryBadge>
                    </TableCell>
                    <TableCell>
                      {typeTranslations[transaction.type]}
                    </TableCell>
                    <AmountCell type={transaction.type}>
                      {transaction.type === 'EXPENSE' ? '- ' : '+ '}
                      {formatCurrency(transaction.amount)}
                    </AmountCell>
                    <ActionsCell>
                      <EditIcon as={Link} to={`/transactions/edit/${transaction.id}`}>
                        <FaEdit />
                      </EditIcon>
                      <DeleteIcon onClick={() => handleDeleteClick(transaction)}>
                        <FaTrash />
                      </DeleteIcon>
                    </ActionsCell>
                  </TableRow>
                ))}
              </TableBody>
            </TransactionsTable>
            
            <Pagination>
              <PageInfo>
                Wyświetlanie {transactions.length} z {pagination.totalElements} transakcji
              </PageInfo>
              <PageButtons>
                <PageButton 
                  onClick={() => handlePageChange(0)}
                  disabled={pagination.page === 0}
                >
                  &lt;&lt;
                </PageButton>
                <PageButton 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 0}
                >
                  &lt;
                </PageButton>
                
                {/* Wyświetlanie numerów stron */}
                {[...Array(Math.min(5, pagination.totalPages)).keys()].map((i) => {
                  // Logika dla wyświetlania stron wokół aktualnej strony
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i;
                  } else if (pagination.page < 3) {
                    pageNumber = i;
                  } else if (pagination.page > pagination.totalPages - 3) {
                    pageNumber = pagination.totalPages - 5 + i;
                  } else {
                    pageNumber = pagination.page - 2 + i;
                  }
                  
                  return (
                    <PageButton 
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      active={pageNumber === pagination.page}
                    >
                      {pageNumber + 1}
                    </PageButton>
                  );
                })}
                
                <PageButton 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages - 1 || pagination.totalPages === 0}
                >
                  &gt;
                </PageButton>
                <PageButton 
                  onClick={() => handlePageChange(pagination.totalPages - 1)}
                  disabled={pagination.page === pagination.totalPages - 1 || pagination.totalPages === 0}
                >
                  &gt;&gt;
                </PageButton>
              </PageButtons>
            </Pagination>
          </>
        )}
      </TransactionsContainer>
      
      {deleteDialogOpen && (
        <DeleteConfirmDialog>
          <DialogContent>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć tę transakcję? Ta operacja jest nieodwracalna.
            </DialogDescription>
            <DialogButtons>
              <CancelButton onClick={cancelDelete}>Anuluj</CancelButton>
              <DeleteButton onClick={confirmDelete}>Usuń</DeleteButton>
            </DialogButtons>
          </DialogContent>
        </DeleteConfirmDialog>
      )}
    </>
  );
};

export default Transactions; 