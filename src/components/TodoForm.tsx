import { useState } from "react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Todo } from "../types/todo";

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

interface TodoFormProps {
  onSubmit: (todo: Todo) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({
        id: Date.now().toString(),
        title: text.trim(),
        completed: false,
        createdAt: Date.now(),
      });
      setText("");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("todo.addNew")}
      />
      <Button type="submit">{t("common.add")}</Button>
    </Form>
  );
};
