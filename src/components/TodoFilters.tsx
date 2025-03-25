import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#4caf50" : "#f0f0f0")};
  color: ${(props) => (props.active ? "white" : "#333")};

  &:hover {
    background-color: ${(props) => (props.active ? "#45a049" : "#e0e0e0")};
  }
`;

const ClearButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f44336;
  color: white;

  &:hover {
    background-color: #da190b;
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
  const { t } = useTranslation();

  return (
    <FilterContainer>
      <FilterButton
        active={filter === "all"}
        onClick={() => onFilterChange("all")}
      >
        {t("todo.filters.all")}
      </FilterButton>
      <FilterButton
        active={filter === "active"}
        onClick={() => onFilterChange("active")}
      >
        {t("todo.filters.active")}
      </FilterButton>
      <FilterButton
        active={filter === "completed"}
        onClick={() => onFilterChange("completed")}
      >
        {t("todo.filters.completed")}
      </FilterButton>
      <ClearButton onClick={onClearCompleted}>
        {t("todo.clearCompleted")}
      </ClearButton>
    </FilterContainer>
  );
};
