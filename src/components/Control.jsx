import React, { useState, useEffect } from 'react';
import "./Control.css";
import { IoMdAdd } from "react-icons/io";
import { BiCheck } from "react-icons/bi";
import { upsertNote } from '../Methods/methods';
import { useCurrent, useSetCurrent, useSetNotes } from '../zustandstore';

const Control = () => {
  const setCurrent= useSetCurrent();
  const current = useCurrent();
  const setNotes = useSetNotes();
  const validate = () => {
    if (!current?.title) return 1;
    if (!current?.text) return 2;
    if (!current?.tag) return 3;
    return 0;
  }

  const save = () => {
    if (current.title && current.text && current.tag) {
      if (current.id)
        upsertNote(current, 2).then(setNotes);
      else
        upsertNote({ ...current, date: new Date().toLocaleDateString() + "T" + new Date().toLocaleTimeString() }, 1).then(setNotes);
      setCurrent(null);
    }
  }

  const enterClicked = () => {
    if(!!!current)
    setCurrent({ id: null, title: "", text: "", tag: "", date: "", pinned: false });
    else setCurrent({...current, text:current.text})
  }

  const handleKeyPress = (e) => {

    const key = e.key;
    if (key === 'Enter') {
      enterClicked()
    }
    if (e.ctrlKey)
      if (key === 's') {
        if (!validate())
          save();
      }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [current]);

  return (
    <div className='control'>
      {!current &&
        <button className='add-btn'
          onClick={() => {
            setCurrent({ id: null, title: "", text: "", tag: "", date: "", pinned: false });
          }}>
          <IoMdAdd className='add-btn-icon' />
        </button>}
      {current &&
        <>
          <input
            className='tag'
            type='text'
            placeholder='Tag'
            value={current.tag}
            maxLength={12}
            onChange={(e) => setCurrent({ ...current, tag: e.target.value })}
          />

          {!validate() && <button
            onClick={() => save()}
            className='save-btn'
          >
            <BiCheck className='save-icon' />
          </button>}
        </>
      }
    </div>
  );
}

export default Control;
