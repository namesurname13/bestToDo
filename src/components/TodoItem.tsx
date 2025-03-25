import { useState } from "react";
import styled from "@emotion/styled";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Todo } from "../types/todo";

const TodoCard = styled(motion.div)`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

const TodoContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
`;

const MoveButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
`;

const Title = styled.span<{ completed: boolean }>`
  flex: 1;
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  color: ${(props) => (props.completed ? "#999" : "#333")};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: 480px) {
    max-width: 200px;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: #c82333;
  }
`;

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const PopupContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1rem;
    max-height: 90vh;
    width: 95%;
    margin: 0 auto;
  }
`;

const PopupTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 0.8rem;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const PopupButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  @media (max-width: 480px) {
    padding-top: 0.8rem;
    gap: 0.8rem;
  }
`;

const PopupButton = styled.button`
  background: ${(props) => props.color || "#4a90e2"};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 100px;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    min-width: 80px;
  }
`;

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string, notes: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedText, setEditedText] = useState(todo.title);
  const [editedNotes, setEditedNotes] = useState(todo.notes || "");
  const { t } = useTranslation();

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleSave = () => {
    if (
      editedText.trim() &&
      (editedText !== todo.title || editedNotes !== todo.notes)
    ) {
      onUpdate(todo.id, editedText.trim(), editedNotes);
    }
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setEditedText(todo.title);
    setEditedNotes(todo.notes || "");
    setIsPopupOpen(false);
  };

  return (
    <>
      <TodoCard
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
      >
        <TodoContent>
          <MoveButton onClick={onMoveUp} disabled={isFirst || todo.completed}>
            ↑
          </MoveButton>
          <MoveButton onClick={onMoveDown} disabled={isLast || todo.completed}>
            ↓
          </MoveButton>
          <Checkbox
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
          />
          <Title
            completed={todo.completed}
            onClick={() => setIsPopupOpen(true)}
          >
            {todo.title}
          </Title>
          <DeleteButton onClick={handleDelete}>×</DeleteButton>
        </TodoContent>
      </TodoCard>

      <AnimatePresence>
        {isPopupOpen && (
          <PopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPopupOpen(false)}
          >
            <PopupContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PopupTitle>{t("todo.editTask")}</PopupTitle>
              <TextArea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder={t("todo.addNew")}
              />
              <TextArea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder={t("todo.notes")}
              />
              <PopupButtons>
                <PopupButton onClick={handleCancel}>
                  {t("common.cancel")}
                </PopupButton>
                <PopupButton onClick={handleSave}>
                  {t("common.save")}
                </PopupButton>
              </PopupButtons>
            </PopupContent>
          </PopupOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
