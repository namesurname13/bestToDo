export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  notes?: string;
}

export interface TodoState {
  todos: Todo[];
}

export type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "REORDER_TODOS"; payload: Todo[] }
  | {
      type: "MOVE_TODO";
      payload: { sourceIndex: number; targetIndex: number };
    };
