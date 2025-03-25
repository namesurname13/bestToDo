import styled from "@emotion/styled";

const FilterPanel = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ isActive?: boolean }>`
  background: ${(props) => (props.isActive ? "#4a90e2" : "#fff")};
  color: ${(props) => (props.isActive ? "#fff" : "#333")};
  border: 2px solid #4a90e2;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.isActive ? "#357abd" : "#f0f0f0")};
  }
`;

const ClearButton = styled(FilterButton)`
  background: #fff;
  color: #dc3545;
  border-color: #dc3545;

  &:hover {
    background: #dc3545;
    color: #fff;
  }
`;

interface TodoFiltersProps {
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onClearCompleted: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <FilterPanel>
      <FilterButton
        isActive={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        Все
      </FilterButton>
      <FilterButton
        isActive={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        Активные
      </FilterButton>
      <FilterButton
        isActive={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        Завершенные
      </FilterButton>
      <ClearButton onClick={onClearCompleted}>Очистить завершенные</ClearButton>
    </FilterPanel>
  );
};
