import React, { useEffect } from 'react';
import "./Notes.css";
import Note from './Note';
import NoteEditor from './NoteEditor';
import { getNotes } from '../Methods/methods';
import Clipboard from 'clipboard';

const Notes = (
  {
    notes,
    setNotes,
    setCurrent,
    current,
    colors,
  }
  ) => {
  const changeText = (newText) => {
    setCurrent({ ...current, text: newText });
  };

  useEffect(() => {

    getNotes().then(setNotes);
    const clipboard = new Clipboard('.copy-icon');

    return () => {
      clipboard.destroy();
    };
  }, [setNotes]);

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'Escape') {
      setCurrent(null);
    }
    if (e.ctrlKey) {
      if (key === '=') {
        document.getElementById("ta").style.fontSize = "1.5em";
      }
      if (key === '-') {
        document.getElementById("ta").style.fontSize = "1em";
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (current && current.text.includes("- ")) {
      changeText(current.text.replace("- ", "\u2022 "));
    }
  }, [current?.text]);

  return (
    <>
      {!current ?
        <div className='notes'>
          {notes
            .filter(({ pinned }) => pinned)
            .map((note, i) => (
              <Note
                key={i + note.id}
                {...note}
                colors={colors}
                setNotes={setNotes}
                setCurrent={setCurrent}
              />
            ))}

          {notes
            .filter(({ pinned }) => !pinned)
            .map((note, i) => (
              <Note
                key={i + note.id}
                {...note}
                colors={colors}
                setNotes={setNotes}
                setCurrent={setCurrent}
              />
            ))}
        </div>
          :
        <NoteEditor
          changeText={changeText}
          current={current}
          setCurrent={setCurrent}
        />
      }
    </>
  );
};

export default Notes;
