import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Global } from "@emotion/react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";
import { TodoFilters } from "./TodoFilters";
import { TodoHeader } from "./TodoHeader";
import { Todo } from "../types/todo";

const globalStyles = {
  "@import":
    "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  "html, body": {
    height: "100%",
    margin: 0,
    padding: 0,
    fontFamily:
      "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
};

const AppContainer = styled.div`
  min-height: 100%;
  width: 100vw;
  background: #f5f5f5;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
`;

const FixedPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #f5f5f5;
  z-index: 10;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 1rem;
  margin-top: 1rem;
  width: 100%;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }
`;

const TodoListContainer = styled.div`
  width: 100%;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`;

/**
 * Основной компонент списка задач.
 * Управляет состоянием задач, их фильтрацией и взаимодействием с localStorage.
 *
 * @component
 */
export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const panelRef = useRef<HTMLDivElement>(null);
  const [containerPadding, setContainerPadding] = useState(0);
  const { t } = useTranslation();

  /**
   * Сохраняет задачи в localStorage при их изменении
   */
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /**
   * Вычисляет высоту фиксированной панели для корректного отображения списка
   */
  useEffect(() => {
    if (panelRef.current) {
      setContainerPadding(panelRef.current.offsetHeight);
    }
  }, []);

  /**
   * Добавляет новую задачу в список
   * @param todo - Новая задача для добавления
   */
  const handleAddTodo = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  /**
   * Переключает статус выполнения задачи
   * @param id - ID задачи для переключения
   */
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * Удаляет задачу из списка
   * @param id - ID задачи для удаления
   */
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  /**
   * Обновляет текст и заметки задачи
   * @param id - ID задачи для обновления
   * @param text - Новый текст задачи
   * @param notes - Новые заметки к задаче
   */
  const handleUpdateTodo = (id: string, text: string, notes: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text, notes } : todo))
    );
  };

  /**
   * Удаляет все завершенные задачи из списка
   */
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  /**
   * Перемещает задачу в списке
   * @param sourceIndex - Исходная позиция задачи
   * @param targetIndex - Целевая позиция задачи
   */
  const handleMoveTodo = (sourceIndex: number, targetIndex: number) => {
    setTodos((prev) => {
      const newTodos = [...prev];
      const [movedTodo] = newTodos.splice(sourceIndex, 1);
      newTodos.splice(targetIndex, 0, movedTodo);
      return newTodos;
    });
  };

  /**
   * Фильтрует задачи в соответствии с выбранным фильтром
   */
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <AppContainer>
      <Global styles={globalStyles} />
      <FixedPanel ref={panelRef}>
        <TodoHeader />
        <TodoForm onSubmit={handleAddTodo} />
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </FixedPanel>
      <Container style={{ paddingTop: containerPadding }}>
        <ScrollContainer>
          <TodoListContainer data-testid="todo-list">
            <AnimatePresence mode="popLayout">
              {filteredTodos.length === 0 ? (
                <EmptyMessage>{t("todo.noTasks")}</EmptyMessage>
              ) : (
                filteredTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                    onMoveUp={() => handleMoveTodo(index, index - 1)}
                    onMoveDown={() => handleMoveTodo(index, index + 1)}
                    isFirst={index === 0}
                    isLast={index === filteredTodos.length - 1}
                  />
                ))
              )}
            </AnimatePresence>
          </TodoListContainer>
        </ScrollContainer>
      </Container>
    </AppContainer>
  );
};
