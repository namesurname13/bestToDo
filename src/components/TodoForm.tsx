import { useState } from "react";
import styled from "@emotion/styled";
import { Todo } from "../types/todo";

const Form = styled.form`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;

  @media (min-width: 600px) {
    flex-wrap: nowrap;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  font-size: 0.95rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const AddButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  width: 100%;

  &:hover {
    background: #357abd;
  }
`;

interface TodoFormProps {
  onSubmit: (todo: Todo) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [newTodo, setNewTodo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    onSubmit(todo);
    setNewTodo("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Добавить новую задачу..."
      />
      <AddButton type="submit">Добавить</AddButton>
    </Form>
  );
};
