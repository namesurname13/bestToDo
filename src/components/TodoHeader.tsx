import styled from "@emotion/styled";

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
  font-size: clamp(1.2rem, 3vw, 2rem);
`;

export const TodoHeader: React.FC = () => {
  return <Title>Todo List</Title>;
};
