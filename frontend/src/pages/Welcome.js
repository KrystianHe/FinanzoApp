import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaChartLine, FaMoneyBillWave, FaSignInAlt, FaUserPlus, FaMobileAlt, FaLock, FaFileAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const WelcomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroWithImage = styled.div`
  background: linear-gradient(135deg, rgba(30, 60, 114, 0.8) 0%, rgba(42, 82, 152, 0.8) 100%),
              url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80');
  background-size: cover;
  background-position: center;
  padding: 3rem 2rem;
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
  color: #e1e8f5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: #fff;
  color: #1e3c72;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    background-color: #f8f8f8;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: #ffffff;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 2.5rem 2rem;
  background-color: var(--light-grey);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: var(--dark-color);
  opacity: 0.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesWrapper = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%);
    z-index: -1;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 1.2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => props.color || 'var(--primary-color)'};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  background-color: var(--light-grey);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.color || 'var(--dark-color)'};
  position: relative;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: var(--dark-color);
  opacity: 0.8;
  line-height: 1.4;
  font-size: 0.9rem;
`;

const IllustrationSection = styled.section`
  padding: 2.5rem 2rem;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const IllustrationContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const IllustrationContent = styled.div`
  flex: 1;
  padding-right: 2rem;
  
  @media (max-width: 992px) {
    padding-right: 0;
    text-align: center;
  }
`;

const IllustrationTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: var(--dark-color);
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const IllustrationDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--dark-color);
  opacity: 0.8;
  line-height: 1.4;
`;

const IllustrationImage = styled.div`
  flex: 1;
  position: relative;
  min-height: 300px;
  background-image: url('https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80');
  background-size: cover;
  background-position: center;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  
  @media (max-width: 992px) {
    width: 100%;
    min-height: 200px;
  }
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  svg {
    color: #4CAF50;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  
  @media (max-width: 992px) {
    text-align: left;
  }
`;

const CTASection = styled.section`
  padding: 2.5rem 2rem;
  background-color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const CTAButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Footer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
`;

const FooterText = styled.p`
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.4;
  font-size: 0.9rem;
`;

const Welcome = () => {
  return (
    <WelcomeContainer>
      <HeroWithImage>
        <HeroContent>
          <HeroTitle>MojeWydatki</HeroTitle>
          <HeroSubtitle>
            Inteligentna aplikacja do zarządzania finansami osobistymi. Kontroluj wydatki, 
            planuj budżet i osiągaj swoje cele finansowe.
          </HeroSubtitle>
          
          <ButtonContainer>
            <PrimaryButton to="/register">
              <FaUserPlus /> Zarejestruj się za darmo
            </PrimaryButton>
            <SecondaryButton to="/login">
              <FaSignInAlt /> Zaloguj się
            </SecondaryButton>
          </ButtonContainer>
        </HeroContent>
      </HeroWithImage>
      
      <FeaturesSection>
        <SectionTitle>Dlaczego MojeWydatki?</SectionTitle>
        <SectionSubtitle>
          Nasza aplikacja pomaga w efektywnym zarządzaniu finansami osobistymi dzięki 
          intuicyjnym narzędziom i przejrzystym statystykom.
        </SectionSubtitle>
        
        <FeaturesWrapper>
          <FeaturesGrid>
            <FeatureCard color="#4CAF50">
              <FeatureTitle color="#4CAF50">Śledzenie wydatków</FeatureTitle>
              <FeatureDescription>
                Łatwe rejestrowanie i kategoryzowanie wydatków na bieżąco.
                Wydatki możesz dodawać szybko i wygodnie z każdego urządzenia.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard color="#2196F3">
              <FeatureTitle color="#2196F3">Zaawansowane statystyki</FeatureTitle>
              <FeatureDescription>
                Przejrzyste wykresy i raporty pomagające zrozumieć, na co wydajesz pieniądze.
                Analizuj swoje wydatki według kategorii i planuj budżet.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard color="#9C27B0">
              <FeatureTitle color="#9C27B0">Dostęp z każdego urządzenia</FeatureTitle>
              <FeatureDescription>
                Aplikacja dostępna na komputerze, tablecie i telefonie - zawsze miej swoje 
                finanse pod kontrolą, gdziekolwiek jesteś.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard color="#FF9800">
              <FeatureTitle color="#FF9800">Bezpieczeństwo danych</FeatureTitle>
              <FeatureDescription>
                Twoje dane finansowe są bezpieczne dzięki zaawansowanym technologiom 
                szyfrowania i dwuetapowej weryfikacji logowania.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard color="#F44336">
              <FeatureTitle color="#F44336">Raportowanie</FeatureTitle>
              <FeatureDescription>
                Generuj i eksportuj raporty finansowe za dowolny okres.
                Pobieraj dane w formatach CSV i PDF do dalszej analizy.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard color="#009688">
              <FeatureTitle color="#009688">Za darmo!</FeatureTitle>
              <FeatureDescription>
                MojeWydatki jest całkowicie darmowe. Nie ma ukrytych opłat,
                reklam ani ograniczeń funkcjonalności.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesWrapper>
      </FeaturesSection>
      
      <IllustrationSection>
        <IllustrationContainer>
          <IllustrationContent>
            <IllustrationTitle>Oszczędzaj czas i pieniądze</IllustrationTitle>
            <IllustrationDescription>
              MojeWydatki to więcej niż aplikacja - to narzędzie, które pomoże Ci osiągnąć 
              finansową niezależność i spokój. Przestań zastanawiać się, gdzie znikają Twoje pieniądze.
            </IllustrationDescription>
            
            <BenefitList>
              <BenefitItem>
                <FaCheckCircle size={20} /> Kontroluj swoje wydatki na bieżąco
              </BenefitItem>
              <BenefitItem>
                <FaCheckCircle size={20} /> Twórz i realizuj cele oszczędnościowe
              </BenefitItem>
              <BenefitItem>
                <FaCheckCircle size={20} /> Planuj budżet i przewiduj przyszłe wydatki
              </BenefitItem>
              <BenefitItem>
                <FaCheckCircle size={20} /> Podejmuj lepsze decyzje finansowe oparte na danych
              </BenefitItem>
            </BenefitList>
            
            <PrimaryButton to="/register" style={{ backgroundColor: '#1e3c72', color: 'white' }}>
              Rozpocznij teraz <FaArrowRight />
            </PrimaryButton>
          </IllustrationContent>
          
          <IllustrationImage />
        </IllustrationContainer>
      </IllustrationSection>
      
      <CTASection>
        <SectionTitle>Zacznij kontrolować swoje finanse już dziś</SectionTitle>
        <SectionSubtitle>
          Dołącz do setek użytkowników, którzy dzięki MojeWydatki oszczędzają pieniądze
          i realizują swoje cele finansowe.
        </SectionSubtitle>
        
        <CTAButton to="/register">
          <FaUserPlus /> Zarejestruj się za darmo <FaArrowRight />
        </CTAButton>
      </CTASection>
      
      <Footer>
        <FooterText>
          © {new Date().getFullYear()} MojeWydatki. Wszelkie prawa zastrzeżone.
          Twój osobisty asystent do zarządzania finansami.
        </FooterText>
      </Footer>
    </WelcomeContainer>
  );
};

export default Welcome; 