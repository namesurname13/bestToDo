import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoList } from "../TodoList";
import { Todo } from "../../types/todo";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/i18n";

/**
 * Тесты для компонента TodoList
 * Проверяют основную функциональность списка задач:
 * - Отображение пустого списка
 * - Работу с localStorage
 * - Фильтрацию задач
 * - Очистку завершенных задач
 */
describe("TodoList", () => {
  const renderTodoList = () => {
    return render(
      <I18nextProvider i18n={i18n}>
        <TodoList />
      </I18nextProvider>
    );
  };

  /**
   * Очищает localStorage перед каждым тестом
   */
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage("en");
  });

  /**
   * Проверяет, что при первом рендере список пуст
   */
  it("renders empty list initially", () => {
    renderTodoList();
    const todoList = screen.getByTestId("todo-list");
    expect(todoList.textContent).toBe("No tasks");
  });

  /**
   * Проверяет загрузку задач из localStorage при монтировании компонента
   */
  it("loads todos from localStorage on mount", () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Test Todo 1",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Test Todo 2",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    renderTodoList();

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  /**
   * Проверяет сохранение новой задачи в localStorage
   */
  it("saves todos to localStorage when adding", async () => {
    renderTodoList();

    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
      expect(savedTodos).toHaveLength(1);
      expect(savedTodos[0].title).toBe("New Todo");
    });
  });

  /**
   * Проверяет фильтрацию задач по статусу (все/активные/завершенные)
   */
  it("filters todos by status", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Active Todo",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Completed Todo",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    renderTodoList();

    // Проверяем, что обе задачи отображаются
    expect(screen.getByText("Active Todo")).toBeInTheDocument();
    expect(screen.getByText("Completed Todo")).toBeInTheDocument();

    // Фильтруем по активным задачам
    fireEvent.click(screen.getByText("Active"));
    await waitFor(() => {
      expect(screen.getByText("Active Todo")).toBeInTheDocument();
      expect(screen.queryByText("Completed Todo")).not.toBeInTheDocument();
    });

    // Фильтруем по завершенным задачам
    fireEvent.click(screen.getByText("Completed"));
    await waitFor(() => {
      expect(screen.queryByText("Active Todo")).not.toBeInTheDocument();
      expect(screen.getByText("Completed Todo")).toBeInTheDocument();
    });
  });

  /**
   * Проверяет функционал очистки завершенных задач
   */
  it("clears completed todos", async () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        title: "Active Todo",
        completed: false,
        createdAt: Date.now(),
      },
      {
        id: "2",
        title: "Completed Todo",
        completed: true,
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("todos", JSON.stringify(mockTodos));

    renderTodoList();

    fireEvent.click(screen.getByText("Clear completed"));

    await waitFor(() => {
      expect(screen.queryByText("Completed Todo")).not.toBeInTheDocument();
      expect(screen.getByText("Active Todo")).toBeInTheDocument();
    });
  });

  it("toggles todo completion when checkbox is clicked", async () => {
    renderTodoList();

    // Добавляем задачу
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");
    fireEvent.change(input, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    // Находим и кликаем по чекбоксу
    const checkbox = await screen.findByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it("deletes todo when delete button is clicked", async () => {
    renderTodoList();

    // Добавляем задачу
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");
    fireEvent.change(input, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    // Находим и кликаем по кнопке удаления
    const deleteButton = await screen.findByText("×");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Test Todo")).not.toBeInTheDocument();
    });
  });

  it("filters todos correctly", async () => {
    renderTodoList();

    // Добавляем несколько задач
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");

    // Добавляем активную задачу
    fireEvent.change(input, { target: { value: "Active Todo" } });
    fireEvent.click(addButton);

    // Добавляем выполненную задачу
    fireEvent.change(input, { target: { value: "Completed Todo" } });
    fireEvent.click(addButton);

    // Находим и кликаем по чекбоксу второй задачи
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    // Проверяем фильтры
    const allButton = screen.getByText("All");
    const activeButton = screen.getByText("Active");
    const completedButton = screen.getByText("Completed");

    fireEvent.click(activeButton);
    await waitFor(() => {
      expect(screen.getByText("Active Todo")).toBeInTheDocument();
      expect(screen.queryByText("Completed Todo")).not.toBeInTheDocument();
    });

    fireEvent.click(completedButton);
    await waitFor(() => {
      expect(screen.queryByText("Active Todo")).not.toBeInTheDocument();
      expect(screen.getByText("Completed Todo")).toBeInTheDocument();
    });

    fireEvent.click(allButton);
    await waitFor(() => {
      expect(screen.getByText("Active Todo")).toBeInTheDocument();
      expect(screen.getByText("Completed Todo")).toBeInTheDocument();
    });
  });

  it("clears completed todos when clear button is clicked", async () => {
    renderTodoList();

    // Добавляем несколько задач
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");

    // Добавляем активную задачу
    fireEvent.change(input, { target: { value: "Active Todo" } });
    fireEvent.click(addButton);

    // Добавляем выполненную задачу
    fireEvent.change(input, { target: { value: "Completed Todo" } });
    fireEvent.click(addButton);

    // Находим и кликаем по чекбоксу второй задачи
    const checkboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);

    // Нажимаем кнопку очистки
    const clearButton = screen.getByText("Clear completed");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Active Todo")).toBeInTheDocument();
      expect(screen.queryByText("Completed Todo")).not.toBeInTheDocument();
    });
  });

  it("persists todos in localStorage", async () => {
    renderTodoList();

    // Добавляем задачу
    const input = screen.getByPlaceholderText("Add new task...");
    const addButton = screen.getByText("Add");
    fireEvent.change(input, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    // Проверяем, что задача сохранилась в localStorage
    const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    expect(savedTodos).toHaveLength(1);
    expect(savedTodos[0].title).toBe("Test Todo");
  });
});
