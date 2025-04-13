import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaChartBar, FaWallet, FaPlus, FaCog, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../utils/api';

const NavbarContainer = styled.nav`
  background-color: var(--white-color);
  box-shadow: var(--shadow);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavbarInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
  
  span {
    color: var(--secondary-color);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    height: 100vh;
    width: 250px;
    flex-direction: column;
    background-color: var(--white-color);
    padding: 2rem;
    box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease-in-out;
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  
  &:hover, &.active {
    background-color: var(--light-grey);
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    width: 100%;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--primary-color);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--primary-color);
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: left;
  
  &:hover {
    background-color: var(--light-grey);
    color: var(--danger-color);
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogout = () => {
    authService.logout();
  };
  
  return (
    <NavbarContainer>
      <NavbarInner>
        <Logo to="/">
          <FaWallet /> Moje<span>Wydatki</span>
        </Logo>
        
        <MenuButton onClick={toggleMenu}>
          <FaBars />
        </MenuButton>
        
        <NavLinks isOpen={isMenuOpen}>
          <CloseButton onClick={closeMenu}>
            <FaTimes />
          </CloseButton>
          
          <NavLink to="/" onClick={closeMenu}>
            <FaHome /> Pulpit
          </NavLink>
          
          <NavLink to="/transactions" onClick={closeMenu}>
            <FaWallet /> Transakcje
          </NavLink>
          
          <NavLink to="/statistics" onClick={closeMenu}>
            <FaChartBar /> Statystyki
          </NavLink>
          
          <NavLink to="/transactions/add" onClick={closeMenu}>
            <FaPlus /> Dodaj
          </NavLink>
          
          <NavLink to="/settings" onClick={closeMenu}>
            <FaCog /> Ustawienia
          </NavLink>
          
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Wyloguj
          </LogoutButton>
        </NavLinks>
      </NavbarInner>
    </NavbarContainer>
  );
};

export default Navbar; 