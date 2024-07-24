import "./reset.css";
import './App.css';
// import "./components/User/User.css"
import User from "./components/User/User"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App By React</h1>
      </header>

      {/* <Banner /> */}
      <User />
      {/* <TodoList /> */}

    </div>
  );
}

export default App;
