import { TodoProvider } from "./context/TodoContext";
import { TodoList } from "./components/TodoList";
import styled from "@emotion/styled";

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
`;

function App() {
  return (
    <TodoProvider>
      <AppContainer>
        <TodoList />
      </AppContainer>
    </TodoProvider>
  );
}

export default App;
