import "./App.css";
import Logo from "./components/Logo";
import Notes from "./components/Notes";
import Control from "./components/Control";

function App() {
  return (
    <div className="container">
      <Logo/>
      <Notes/>
      <Control/>
    </div>
  );
}

export default App;
