import React, { useState } from 'react';
import "./Note.css";
import { BiSolidTrashAlt } from "react-icons/bi";
import { deleteNote, upsertNote } from '../Methods/methods';
import { BsPinAngleFill, BsPinFill } from "react-icons/bs";
import hexColorAverage from '../Methods/colors';

const Note = ({ id, title, text, tag, date, pinned, setNotes, setCurrent, colors }) => {
  const [focus, setFocus] = useState(false);

  const handleDeleteNote = (e) => {
    e.stopPropagation();
    deleteNote(id).then(setNotes);
  };

  const handlePinNote = async (e) => {
    e.stopPropagation();
    upsertNote({ id, title, text, tag, date, pinned: true }, 2).then(setNotes);
  };

  const handleUnpinNote = async (e) => {
    e.stopPropagation();
    upsertNote({ id, title, text, tag, date, pinned: false }, 2).then(setNotes);
  };

  const handleClick = () => {
    setCurrent({ id, title, text, tag, date, pinned });
  };

  return (
    <div
      className='note-brief'
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
              className='pin-icon'
              onClick={handlePinNote}
            />
          }
        </>
      }
      {pinned &&
        <BsPinAngleFill
          style={{ color: hexColorAverage(colors.primary_color, colors.secondary_color, 1) }}
          className='pinned-icon'
          title='Unpin'
          onClick={handleUnpinNote}
        />
      }
    </div>
  );
};

export default Note;