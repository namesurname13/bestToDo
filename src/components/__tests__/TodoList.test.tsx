import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoList } from "../TodoList";
import { Todo } from "../../types/todo";

/**
 * Тесты для компонента TodoList
 * Проверяют основную функциональность списка задач:
 * - Отображение пустого списка
 * - Работу с localStorage
 * - Фильтрацию задач
 * - Очистку завершенных задач
 */
describe("TodoList", () => {
  /**
   * Очищает localStorage перед каждым тестом
   */
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Проверяет, что при первом рендере список пуст
   */
  it("отображает пустой список при первом рендере", () => {
    render(<TodoList />);
    expect(screen.getByTestId("todo-list")).toBeEmptyDOMElement();
  });

  /**
   * Проверяет загрузку задач из localStorage при монтировании компонента
   */
  it("загружает задачи из localStorage при монтировании", () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Тестовая задача 1",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Тестовая задача 2",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    render(<TodoList />);

    expect(screen.getByText("Тестовая задача 1")).toBeInTheDocument();
    expect(screen.getByText("Тестовая задача 2")).toBeInTheDocument();
  });

  /**
   * Проверяет сохранение новой задачи в localStorage
   */
  it("сохраняет задачи в localStorage при добавлении", async () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Добавить новую задачу...");
    const addButton = screen.getByText("Добавить");

    fireEvent.change(input, { target: { value: "Новая задача" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
      expect(savedTodos).toHaveLength(1);
      expect(savedTodos[0].title).toBe("Новая задача");
    });
  });

  /**
   * Проверяет фильтрацию задач по статусу (все/активные/завершенные)
   */
  it("фильтрует задачи по статусу", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Активная задача",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Завершенная задача",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    render(<TodoList />);

    // Проверяем, что обе задачи отображаются
    expect(screen.getByText("Активная задача")).toBeInTheDocument();
    expect(screen.getByText("Завершенная задача")).toBeInTheDocument();

    // Фильтруем по активным задачам
    fireEvent.click(screen.getByText("Активные"));
    await waitFor(() => {
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
      expect(screen.queryByText("Завершенная задача")).not.toBeInTheDocument();
    });

    // Фильтруем по завершенным задачам
    fireEvent.click(screen.getByText("Завершенные"));
    await waitFor(() => {
      expect(screen.queryByText("Активная задача")).not.toBeInTheDocument();
      expect(screen.getByText("Завершенная задача")).toBeInTheDocument();
    });
  });

  /**
   * Проверяет функционал очистки завершенных задач
   */
  it("очищает завершенные задачи", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Активная задача",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Завершенная задача",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    render(<TodoList />);

    fireEvent.click(screen.getByText("Очистить завершенные"));

    await waitFor(() => {
      expect(screen.queryByText("Завершенная задача")).not.toBeInTheDocument();
      expect(screen.getByText("Активная задача")).toBeInTheDocument();
    });
  });
});
