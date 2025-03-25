import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const LanguageSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: black;
  cursor: pointer;
  font-size: 1.2rem;
  width: 60px;
  text-align: center;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const LanguageOption = styled.option`
  font-size: 1.2rem;
  text-align: center;
`;

export const TodoHeader: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Header>
      <Title>Todo List</Title>
      <LanguageSelector value={i18n.language} onChange={changeLanguage}>
        <LanguageOption value="ru">🇷🇺</LanguageOption>
        <LanguageOption value="en">🇬🇧</LanguageOption>
      </LanguageSelector>
    </Header>
  );
};
