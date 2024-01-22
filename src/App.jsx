import "./App.css";
import Head from "./components/Head";
import Mid from "./components/Mid";
import Bottom from "./components/Bottom";

//The Global Component
function App() {
  return (
    <div className="container">
      <Head/>
      <Mid/>
      <Bottom/>
    </div>
  );
}

export default App;
