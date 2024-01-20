import React, { useState } from 'react';
import "./Note.css";
import "../Animation.css"
import { BiSolidTrashAlt } from "react-icons/bi";
import { deleteNote, upsertNote } from '../Methods/methods';
import { BsPinAngleFill, BsPinFill } from "react-icons/bs";
import hexColorAverage from '../Methods/colors';

const Note = (
  {
    id,
    title,
    text,
    tag,
    date,
    pinned,
    setNotes,
    setCurrent,
    colors,
  }) => {
  const [focus, setFocus] = useState(false);
  const [animation, setAnimation] = useState(
    {
      note:"",
      pin:"",
      pinned:"",
    }
  )
  const handleDeleteNote = (e) => {
    e.stopPropagation();
    setAnimation({...animation, note:"fade-out"})
    setTimeout(() => {
      deleteNote(id).then(setNotes);
      setAnimation({...animation, note:""})
    }, 500);
  };

  const handlePinNote = async (e) => {
    e.stopPropagation();
    setAnimation({...animation, pin:"fade-out", pinned:"fade-in"})
    setTimeout(() => {
      upsertNote({ id, title, text, tag, date, pinned: true }, 2).then(setNotes);
      setAnimation({...animation, pin:"", pinned:""})
    }, 500);
  };

  const handleUnpinNote = async (e) => {
    e.stopPropagation();
    setAnimation({...animation, pin:"fade-int", pinned:"fade-out"})
    setTimeout(() => {
      upsertNote({ id, title, text, tag, date, pinned: false }, 2).then(setNotes);
      setAnimation({...animation, pin:"", pinned:""})
    }, 500);
  };

  const handleClick = () => {
    setAnimation({...animation, note:"open-note"})
    setTimeout(() => {
      setCurrent({ id, title, text, tag, date, pinned });
      setAnimation({...animation, note:""})
    }, 200);
  };

  return (
    <div
      className={'note-brief ' + animation.note}
      onMouseMoveCapture={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      onClick={handleClick}
    >
      {focus && <p className='tag-brief'>{tag}</p>}
      <p className='title-brief'>{title}</p>
      <p className='text-brief'>{text.slice(0, 20)}...</p>
      {focus &&
        <>
          <BiSolidTrashAlt
            title='Delete note'
            onClick={handleDeleteNote}
            className='delete-note-icon'
          />
          {!pinned &&
            <BsPinFill
              title='Pin note'
              className={'pin-icon ' + animation.pin}
              onClick={handlePinNote}
            />
          }
        </>
      }
      {pinned &&
        <BsPinAngleFill
          style={{ color: hexColorAverage(colors.primary_color, colors.secondary_color, 1) }}
          className={'pinned-icon ' + animation.pinned}
          title='Unpin'
          onClick={handleUnpinNote}
        />
      }
    </div>
  );
};

export default Note;