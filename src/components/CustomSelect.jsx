import React from 'react';
import Select from 'react-select';

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#BED3C4' : 'gray',
    '&:hover': {
      borderColor: state.isFocused ? '#BED3C4' : 'gray',
    },
    boxShadow: state.isFocused ? '0 0 0 1px #BED3C4' : 'none',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#B6C9B5',
    padding:"8px",
    borderRadius:"5px"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'black',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'red',
    '&:hover': {
      backgroundColor: 'darkred',
      color: 'white',
      borderRadius:"50%"
    },
    marginLeft:"4px"
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

