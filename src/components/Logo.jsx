// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import "./Logo.css";
// import { BiSearch, BiSolidTrashAlt } from "react-icons/bi";
// import { MdInvertColors } from "react-icons/md";
// import { FaArrowLeft } from "react-icons/fa6";
// import { deleteNotes, deleteNote, upsertNote, unpinNotes, searchNotes } from '../Methods/methods';
// import { getConfig, setConfig } from '../Methods/config';
// import hexColorAverage, { getRandomGoodHexColor, getRandomHexColor } from '../Methods/colors';
// import { BsPinAngleFill, BsPinFill } from "react-icons/bs";

// const changeAppColors = (main, border) => {
//   document.documentElement.style.setProperty('--main', main);
//   document.documentElement.style.setProperty('--border', border);
// }

// const Logo = ({ setNotes, current, setCurrent, colors, setColors }) => {
//   const [showColors, setShowColors] = useState(false);
//   const [searchMode, setSearchMode] = useState(false);
//   const [search, setSearch] = useState("");
  
//   useEffect(() => {
//     getConfig().then(setColors);
//     changeAppColors(colors.primary_color, colors.secondary_color);
//   }, []);

//   useEffect(() => {
//     setConfig(colors).then(setColors);
//     changeAppColors(colors.primary_color, colors.secondary_color);
//   }, [colors.primary_color, colors.secondary_color]);

//   useEffect(() => {
//     searchNotes(search).then(setNotes);
//   }, [search]);

//   return (
//     <div className='logo'>
//       {!showColors && !current &&
//         <MdInvertColors title='Change theme!' className='colors-icon' onClick={() => setShowColors(!showColors)} />
//       }

//       {showColors && !current &&
//         <div
//           className='colors-container' style={{
//             backgroundColor: hexColorAverage(
//               colors.primary_color,
//               colors.secondary_color,
//               1
//             )
//           }}>
//           <input
//             title='This is the background color!'
//             type='color'
//             value={colors.primary_color}
//             onChange={e => setColors({ ...colors, primary_color: e.target.value })}
//             className='color-picker'
//           />
//           <input
//             title='This is the foreground color!'
//             type='color'
//             value={colors.secondary_color}
//             onChange={e => setColors({ ...colors, secondary_color: e.target.value })}
//             className='color-picker'
//           />
//         </div>
//       }

//       {showColors && !current && <>
//         <p
//           style={{
//             color: hexColorAverage(
//               colors.primary_color,
//               colors.secondary_color,
//               0.5
//             )
//           }}
//           onClick={() => {
//             setColors({
//               primary_color: "#DCC9B6",
//               secondary_color: "#6D4C3D"
//             });
//             setShowColors(false);
//           }}
//           className='default-colors'
//         >Set default</p>

//         <p
//           style={{
//             color: hexColorAverage(
//               colors.primary_color,
//               colors.secondary_color,
//               0.5
//             )
//           }}
//           onClick={() => setShowColors(false)}
//           className='close-colors'
//         >Close</p>

//         <p
//           style={{
//             color: hexColorAverage(
//               colors.primary_color,
//               colors.secondary_color,
//               0.5
//             )
//           }}
//           onClick={() => {
//             // setColors({
//             //   primary_color: getRandomHexColor(),
//             //   secondary_color: getRandomHexColor()
//             // })
//             console.log(getRandomGoodHexColor());
//             setColors(getRandomGoodHexColor());
//           }}
//           className='random-colors'
//         >Randomly</p>
//       </>
//       }

//       {!searchMode ? <h2 className='logo-text'>
//         {current ? <>
//           <input
//             className='title'
//             type='text'
//             placeholder='Title'
//             value={current.title}
//             maxLength={17}
//             onChange={(e) => setCurrent({ ...current, title: e.target.value })}
//           />
//           <FaArrowLeft
//             title='Cancel and back'
//             className='back-icon'
//             onClick={() => setCurrent(null)}
//           />
//         </> : "n o t e s"}
//       </h2> :
//         <input
//           className='title'
//           type='text'
//           placeholder='search here...'
//           value={search}
//           maxLength={100}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       }

//       <BiSolidTrashAlt
//         className='delete-all'
//         title={current ? 'Delete this note' : 'Delete All'}
//         onClick={() => {
//           if (current) {
//             deleteNote(current.id).then(setNotes);
//             setCurrent(null);
//           } else {
//             setNotes([]);
//             deleteNotes();
//           }
//         }}
//       />

//       {(!current || current.pinned) && <BsPinAngleFill
//         className='unpin-all'
//         title={current ? 'Unpin this note' : 'Unpin All'}
//         onClick={() => {
//           if (current) {
//             upsertNote({ ...current, pinned: false }, 2).then(setNotes);
//             setCurrent({ ...current, pinned: false });
//           } else {
//             unpinNotes().then(setNotes);
//           }
//         }}
//       />}

//       {current && current.pinned == false &&
//         <BsPinFill
//           title='pin this note'
//           className='unpin-all'
//           onClick={() => {
//             upsertNote({ ...current, pinned: true }, 2).then(setNotes);
//             setCurrent({ ...current, pinned: true });
//           }}
//         />
//       }

//       {!searchMode && !current && !showColors &&
//         <BiSearch
//           onClick={() => setSearchMode(true)}
//           title='search for notes'
//           className='search-icon'
//         />
//       }

//       {searchMode && !current && !showColors &&
//         <p
//           onClick={() => setSearchMode(false)}
//           title='cancel search'
//           className='cancel-search'
//         >cancel</p>
//       }

//     </div>
//   );
// }

// export default Logo;
import React, { useEffect, useReducer } from 'react';
import "./Logo.css";
import { BiSearch, BiSolidTrashAlt } from "react-icons/bi";
import { MdInvertColors } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { deleteNotes, deleteNote, upsertNote, unpinNotes, searchNotes } from '../Methods/methods';
import { getConfig, setConfig } from '../Methods/config';
import hexColorAverage, { getRandomGoodHexColor } from '../Methods/colors';
import { BsPinAngleFill, BsPinFill } from "react-icons/bs";

const initialState = {
  showColors: false,
  searchMode: false,
  search: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggleColors':
      return { ...state, showColors: !state.showColors };
    case 'toggleSearchMode':
      return { ...state, searchMode: !state.searchMode };
    case 'setSearch':
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const changeAppColors = (main, border) => {
  document.documentElement.style.setProperty('--main', main);
  document.documentElement.style.setProperty('--border', border);
};

const Logo = ({ setNotes, current, setCurrent, colors, setColors }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getConfig().then(setColors);
    changeAppColors(colors.primary_color, colors.secondary_color);
  }, []);

  useEffect(() => {
    setConfig(colors).then(setColors);
    changeAppColors(colors.primary_color, colors.secondary_color);
  }, [colors.primary_color, colors.secondary_color]);

  useEffect(() => {
    searchNotes(state.search).then(setNotes);
  }, [state.search]);

  const handleToggleColors = () => {
    dispatch({ type: 'toggleColors' });
  };

  const handleToggleSearchMode = () => {
    dispatch({ type: 'toggleSearchMode' });
  };

  const handleSetSearch = (e) => {
    dispatch({ type: 'setSearch', payload: e.target.value });
  };

  const handleDelete = () => {
    if (current) {
      deleteNote(current.id).then(setNotes);
      setCurrent(null);
    } else {
      setNotes([]);
      deleteNotes();
    }
  };

  const handleUnpin = () => {
    if (current) {
      upsertNote({ ...current, pinned: false }, 2).then(setNotes);
      setCurrent({ ...current, pinned: false });
    } else {
      unpinNotes().then(setNotes);
    }
  };

  const handlePin = () => {
    upsertNote({ ...current, pinned: true }, 2).then(setNotes);
    setCurrent({ ...current, pinned: true });
  };

  const handleSetColors = (colorType, value) => {
    setColors({ ...colors, [colorType]: value });
  };

  const handleSetDefaultColors = () => {
    setColors({
      primary_color: "#DCC9B6",
      secondary_color: "#6D4C3D"
    });
    dispatch({ type: 'toggleColors' });
  };

  const handleSetRandomColors = () => {
    setColors(getRandomGoodHexColor());
  };

  return (
    <div className='logo'>
      {!state.showColors && !current &&
        <MdInvertColors title='Change theme!' className='colors-icon' onClick={handleToggleColors} />
      }

      {state.showColors && !current &&
        <div
          className='colors-container' style={{
            backgroundColor: hexColorAverage(
              colors.primary_color,
              colors.secondary_color,
              1
            )
          }}>
          <input
            title='This is the background color!'
            type='color'
            value={colors.primary_color}
            onChange={(e) => handleSetColors('primary_color', e.target.value)}
            className='color-picker'
          />
          <input
            title='This is the foreground color!'
            type='color'
            value={colors.secondary_color}
            onChange={(e) => handleSetColors('secondary_color', e.target.value)}
            className='color-picker'
          />
        </div>
      }

      {state.showColors && !current && <>
        <p
          style={{
            color: hexColorAverage(
              colors.primary_color,
              colors.secondary_color,
              0.5
            )
          }}
          onClick={handleSetDefaultColors}
          className='default-colors'
        >Set default</p>

        <p
          style={{
            color: hexColorAverage(
              colors.primary_color,
              colors.secondary_color,
              0.5
            )
          }}
          onClick={() => dispatch({ type: 'toggleColors' })}
          className='close-colors'
        >Close</p>

        <p
          style={{
            color: hexColorAverage(
              colors.primary_color,
              colors.secondary_color,
              0.5
            )
          }}
          onClick={handleSetRandomColors}
          className='random-colors'
        >Randomly</p>
      </>
      }

      {!state.searchMode ? 
      <h2 className='logo-text'>
        {current ? <>
          <input
            className='title'
            type='text'
            placeholder='Title'
            value={current.title}
            maxLength={17}
            onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          />
          <FaArrowLeft
            title='Cancel and back'
            className='back-icon'
            onClick={() => setCurrent(null)}
          />
        </> : "n o t e s"}
      </h2> :
        <input
          className='title'
          type='text'
          placeholder='search here...'
          value={state.search}
          maxLength={100}
          onChange={handleSetSearch}
        />
      }

      <BiSolidTrashAlt
        className='delete-all'
        title={current ? 'Delete this note' : 'Delete All'}
        onClick={handleDelete}
      />

      {(!current || current.pinned) &&
      <BsPinAngleFill
        className='unpin-all'
        title={current ? 'Unpin this note' : 'Unpin All'}
        onClick={handleUnpin}
      />}

      {current && current.pinned === false &&
        <BsPinFill
          title='pin this note'
          className='unpin-all'
          onClick={handlePin}
        />
      }

      {!state.searchMode && !current && !state.showColors &&
        <BiSearch
          onClick={handleToggleSearchMode}
          title='search for notes'
          className='search-icon'
        />
      }

      {state.searchMode && !current && !state.showColors &&
        <p
          onClick={handleToggleSearchMode}
          title='cancel search'
          className='cancel-search'
        >cancel</p>
      }
    </div>
  );
}

export default Logo;
