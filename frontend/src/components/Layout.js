import React from 'react';
import Navbar from './Navbar';
import styled from 'styled-components';

const MainContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Footer = styled.footer`
  background-color: var(--white-color);
  padding: 1.5rem 0;
  text-align: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
`;

const FooterText = styled.p`
  color: var(--dark-color);
  font-size: 0.9rem;
`;

const Layout = ({ children }) => {
  return (
    <MainContainer>
      <Navbar />
      <Content>
        <ContentContainer>
          {children}
        </ContentContainer>
      </Content>
      <Footer>
        <FooterText>© {new Date().getFullYear()} MojeWydatki - Twój osobisty asystent finansowy</FooterText>
      </Footer>
    </MainContainer>
  );
};

export default Layout; 