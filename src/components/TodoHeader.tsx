import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;

const LanguageSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
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
        <option value="ru">Русский</option>
        <option value="en">English</option>
      </LanguageSelector>
    </Header>
  );
};
