import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../TodoItem";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/i18n";

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
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
    createdAt: Date.now(),
  };

  /**
   * Моковые обработчики событий
   */
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnMoveUp = jest.fn();
  const mockOnMoveDown = jest.fn();

  /**
   * Очищает моки перед каждым тестом
   */
  beforeEach(() => {
    jest.clearAllMocks();
    i18n.changeLanguage("en");
  });

  /**
   * Проверяет корректное отображение заголовка задачи
   */
  it("отображает заголовок задачи", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  /**
   * Проверяет переключение статуса задачи при клике на чекбокс
   */
  it("вызывает onToggle при клике на чекбокс", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  /**
   * Проверяет удаление задачи при клике на кнопку удаления
   */
  it("вызывает onDelete при клике на кнопку удаления", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );
    const deleteButton = screen.getByText("×");
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  /**
   * Проверяет открытие модального окна для редактирования
   */
  it("открывает модальное окно при клике на заголовок", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );
    const title = screen.getByText("Test Todo");
    fireEvent.click(title);
    expect(screen.getByText("Edit task")).toBeInTheDocument();
  });

  /**
   * Проверяет сохранение изменений в модальном окне
   */
  it("вызывает onUpdate при сохранении изменений в модальном окне", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );

    // Открываем модальное окно
    const title = screen.getByText("Test Todo");
    fireEvent.click(title);

    // Изменяем заголовок
    const textarea = screen.getByTestId("edit-todo-title");
    fireEvent.change(textarea, { target: { value: "Updated Todo" } });
    fireEvent.click(screen.getByText("Save"));

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTodo.id, "Updated Todo");
  });

  /**
   * Проверяет работу кнопок перемещения задачи
   */
  it("отображает кнопки перемещения и вызывает соответствующие обработчики", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );

    const upButton = screen.getByText("↑");
    const downButton = screen.getByText("↓");

    fireEvent.click(upButton);
    expect(mockOnMoveUp).toHaveBeenCalled();

    fireEvent.click(downButton);
    expect(mockOnMoveDown).toHaveBeenCalled();
  });

  /**
   * Проверяет корректное отключение кнопок перемещения
   * для первой и последней задачи в списке
   */
  it("отключает кнопки перемещения для первой и последней задачи", () => {
    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={true}
          isLast={false}
        />
      </I18nextProvider>
    );
    expect(screen.getByText("↑")).toBeDisabled();
    expect(screen.getByText("↓")).not.toBeDisabled();

    rerender(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={true}
        />
      </I18nextProvider>
    );
    expect(screen.getByText("↑")).not.toBeDisabled();
    expect(screen.getByText("↓")).toBeDisabled();
  });

  /**
   * Проверяет отключение кнопок перемещения при выполнении задачи
   */
  it("отключает кнопки перемещения при выполнении задачи", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <I18nextProvider i18n={i18n}>
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onUpdate={mockOnUpdate}
          onMoveUp={mockOnMoveUp}
          onMoveDown={mockOnMoveDown}
          isFirst={false}
          isLast={false}
        />
      </I18nextProvider>
    );

    const upButton = screen.getByText("↑");
    const downButton = screen.getByText("↓");

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();
  });
});
