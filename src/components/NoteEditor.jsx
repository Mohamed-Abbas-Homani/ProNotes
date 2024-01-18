import "./Notes.css";
import { FaEraser } from "react-icons/fa6";
import { RxLetterCaseUppercase as Upicon, RxLetterCaseLowercase as Lowicon } from "react-icons/rx";
import { FaCopy, FaList } from "react-icons/fa6";
import { PiNumberTwoFill as Two } from "react-icons/pi";
import { MdRemove } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { useState } from "react";

const wordsNumber = (text) => {
  let final = 0;
  if (!text) return final;
  if (text.includes("\n")) {
    text.split("\n").map((line) => {
      final += line.trim().split(" ").length;
    });
  } else {
    final = text.split(" ").length;
  }
  return final;
};

const listed = (text) => {
  let new_text = "";
  text.split("\n").map((line) => {
    new_text += line.startsWith("\u2022") || line.endsWith(":")
      ? line + "\n"
      : `\u2022 ${line}\n`;
  });
  return new_text;
};

const NoteEditor = ({ current, setCurrent, changeText }) => {
  const [showTime, setShowTime] = useState(false);

  const handleClear = () => {
    changeText("");
  };

  const handleUpperCase = () => {
    changeText(current.text.toUpperCase());
  };

  const handleLowerCase = () => {
    changeText(current.text.toLowerCase());
  };

  const handleDuplicate = () => {
    changeText(current.text + current.text);
  };

  const handleListLines = () => {
    changeText(listed(current.text));
  };

  const handleAddHorizontalLine = () => {
    changeText(current.text + "\n__________________________________________");
  };

  return (
    <div className='show-current'>
      <textarea
        id='ta'
        className='text'
        placeholder='Write down your note...'
        value={current.text}
        onChange={(e) => {
          changeText(e.target.value);
        }}
      />
      <FaEraser
        title='clear'
        onClick={handleClear}
        className='erase-icon icon'
      />
      <Upicon
        title='to Upper Case'
        onClick={handleUpperCase}
        className='up-icon icon'
      />
      <Lowicon
        title='to Lower Case'
        onClick={handleLowerCase}
        className='low-icon icon'
      />
      <FaCopy
        title='copy to clipboard'
        data-clipboard-target='.text'
        className='copy-icon icon'
      />
      <Two
        title='duplicate'
        onClick={handleDuplicate}
        className='icon duplicate-icon'
      />
      <FaList
        title='list lines, use ":" at the line end for exceptions'
        className='icon list-icon'
        onClick={handleListLines}
      />
      <MdRemove
        title='Add an horizontal line'
        className='icon line-icon'
        onClick={handleAddHorizontalLine}
      />
      <span
        title={`${current.text.length} letters`}
        className='letters'
      >
        {wordsNumber(current.text.trim().replace(/\s+/g, ' '))} words
      </span>
      {!!current.id && !!current.date && (
        <>
          <BiTimeFive
            title="creation date"
            className="time-icon"
            onClick={() => setShowTime(!showTime)}
          />
          {showTime && (
            <>
              <p className="date-display">{current.date.split("T")[0]}</p>
              <p className="time-display1 time">{current.date.split("T")[1].slice(0, 2)}</p>
              <p className="time-display2 time">{current.date.split("T")[1].slice(3, 5)}</p>
              <p className="time-display3 time">{current.date.split("T")[1].slice(9, 11).toLowerCase()}</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NoteEditor;
