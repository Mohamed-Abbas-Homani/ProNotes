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

const Logo = (
  {
    setNotes,
    current,
    setCurrent,
    colors,
    setColors,
  }
  ) => {
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
  }, [state.search, current]);

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

  const atHomeColorsClicked = state.showColors && !current
  const atHomeColorsNotClicked = !state.showColors && !current 
  const atHomeOrPinnedNote = !current || current.pinned

  return (
    <div className='logo'>
      {atHomeColorsNotClicked &&
        <MdInvertColors title='Change theme!' className='colors-icon' onClick={handleToggleColors} />
      }

      {atHomeColorsClicked && <>
        <div
          className='colors-container'
          style={{
            backgroundColor: hexColorAverage(
            colors.primary_color,
            colors.secondary_color,
            1)}}
        >
          <input
            title='This is the background color!'
            type='color'
            value={colors.primary_color}
            onChange={({target}) => handleSetColors('primary_color',
            target.value.length>7?'#ffffff':target.value)}
            className='color-picker'
          />
          <input
            title='This is the foreground color!'
            type='color'
            value={colors.secondary_color}
            onChange={({target}) => handleSetColors('secondary_color',
            target.value.length>7?'#000000':target.value)}
            className='color-picker'
          />
        </div>
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
        >
        Set default
        </p>
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
        >
        Close
        </p>
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
        >
        Randomly
        </p>
      </>}
 
      <h2 className='logo-text'>
        {current ?
        <>
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
        </>
        :
        (state.searchMode?
        <input
          className='title'
          type='text'
          placeholder='search here...'
          value={state.search}
          maxLength={100}
          onChange={handleSetSearch}
        />
        :
        "n o t e s"
        )}
      </h2> 
        
       
    

      <BiSolidTrashAlt
        className='delete-all'
        title={current ? 'Delete this note' : 'Delete All'}
        onClick={handleDelete}
      />

      {atHomeOrPinnedNote &&
      <BsPinAngleFill
        className='unpin-all'
        title={current ? 'Unpin this note' : 'Unpin All'}
        onClick={handleUnpin}
      />}

      {!atHomeOrPinnedNote &&
        <BsPinFill
          title='pin this note'
          className='unpin-all'
          onClick={handlePin}
        />
      }

      {!state.searchMode && atHomeColorsNotClicked &&
        <BiSearch
          onClick={handleToggleSearchMode}
          title='search for notes'
          className='search-icon'
        />
      }

      {state.searchMode && atHomeColorsNotClicked &&
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
