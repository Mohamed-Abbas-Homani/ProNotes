import React, { useEffect } from 'react';
import "./Notes.css";
import Note from './Note';
import NoteEditor from './NoteEditor';
import { getNotes } from '../Methods/methods';
import Clipboard from 'clipboard';
import { useColors, useCurrent, useNotes, useSetCurrent, useSetNotes } from '../zustandstore';

const Notes = () => {
  const notes = useNotes();
  const setNotes = useSetNotes();
  const setCurrent = useSetCurrent();
  const current = useCurrent();
  const colors = useColors();

  useEffect(() => {
    getNotes().then(setNotes);
    const clipboard = new Clipboard('.copy-icon');

    return () => {
      clipboard.destroy();
    };
  }, []);

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
              />
            ))}

          {notes
            .filter(({ pinned }) => !pinned)
            .map((note, i) => (
              <Note
                key={i + note.id}
                {...note}
              />
            ))}
        </div>
          :
        <NoteEditor/>
      }
    </>
  );
};

export default Notes;
