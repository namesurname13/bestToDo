import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../TodoItem";
import { Todo } from "../../types/todo";

/**
 * Тесты для компонента TodoItem
 * Проверяют функциональность отдельной задачи:
 * - Отображение заголовка
 * - Переключение статуса
 * - Удаление
 * - Редактирование
 * - Перемещение в списке
 */
describe("TodoItem", () => {
  /**
   * Моковые данные для тестирования
   */
  const mockTodo: Todo = {
    id: "1",
    title: "Тестовая задача",
    completed: false,
    createdAt: Date.now(),
  };

  /**
   * Моковые обработчики событий
   */
  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
    onMoveUp: jest.fn(),
    onMoveDown: jest.fn(),
  };

  /**
   * Очищает моки перед каждым тестом
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Проверяет корректное отображение заголовка задачи
   */
  it("отображает заголовок задачи", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );
    expect(screen.getByText("Тестовая задача")).toBeInTheDocument();
  });

  /**
   * Проверяет переключение статуса задачи при клике на чекбокс
   */
  it("вызывает onToggle при клике на чекбокс", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  /**
   * Проверяет удаление задачи при клике на кнопку удаления
   */
  it("вызывает onDelete при клике на кнопку удаления", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );
    const deleteButton = screen.getByText("×");
    fireEvent.click(deleteButton);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  /**
   * Проверяет открытие модального окна для редактирования
   */
  it("открывает модальное окно при клике на заголовок", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );
    const title = screen.getByText("Тестовая задача");
    fireEvent.click(title);
    expect(screen.getByText("Редактировать задачу")).toBeInTheDocument();
  });

  /**
   * Проверяет сохранение изменений в модальном окне
   */
  it("вызывает onUpdate при сохранении изменений в модальном окне", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );

    // Открываем модальное окно
    const title = screen.getByText("Тестовая задача");
    fireEvent.click(title);

    // Изменяем заголовок
    const input = screen.getByDisplayValue("Тестовая задача");
    fireEvent.change(input, { target: { value: "Обновленная задача" } });

    // Сохраняем изменения
    const saveButton = screen.getByText("Сохранить");
    fireEvent.click(saveButton);

    expect(mockHandlers.onUpdate).toHaveBeenCalledWith(
      mockTodo.id,
      "Обновленная задача",
      ""
    );
  });

  /**
   * Проверяет работу кнопок перемещения задачи
   */
  it("отображает кнопки перемещения и вызывает соответствующие обработчики", () => {
    render(
      <TodoItem
        todo={mockTodo}
        isFirst={false}
        isLast={false}
        {...mockHandlers}
      />
    );

    const moveUpButton = screen.getByText("↑");
    const moveDownButton = screen.getByText("↓");

    fireEvent.click(moveUpButton);
    expect(mockHandlers.onMoveUp).toHaveBeenCalled();

    fireEvent.click(moveDownButton);
    expect(mockHandlers.onMoveDown).toHaveBeenCalled();
  });

  /**
   * Проверяет корректное отключение кнопок перемещения
   * для первой и последней задачи в списке
   */
  it("отключает кнопки перемещения для первой и последней задачи", () => {
    const { rerender } = render(
      <TodoItem
        todo={mockTodo}
        isFirst={true}
        isLast={false}
        {...mockHandlers}
      />
    );
    expect(screen.getByText("↑")).toBeDisabled();
    expect(screen.getByText("↓")).not.toBeDisabled();

    rerender(
      <TodoItem
        todo={mockTodo}
        isFirst={false}
        isLast={true}
        {...mockHandlers}
      />
    );
    expect(screen.getByText("↑")).not.toBeDisabled();
    expect(screen.getByText("↓")).toBeDisabled();
  });
});
