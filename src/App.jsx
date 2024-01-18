

// export default App;
import {useMemo, useState } from "react";
import "./App.css";
import Logo from "./components/Logo";
import Notes from "./components/Notes";
import Control from "./components/Control";

function App() {
  const [notes, setNotes] = useState([]);
  const [current, setCurrent] = useState(null)
  const [colors, setColors] = useState({})

  const memoizedNotes = useMemo(() =>  notes, [notes])

  return (
    <div className="container">
      <Logo
      colors={colors}
      setColors={setColors}
      current={current}
      setCurrent={setCurrent}
      setNotes={setNotes}
      />

      <Notes
      colors={colors}
      notes={memoizedNotes}
      current={current}
      setCurrent={setCurrent}
      setNotes={setNotes}
      />

      <Control
      current={current}
      setCurrent={setCurrent}
      setNotes={setNotes}
      />
    </div>
  );
}

export default App;
