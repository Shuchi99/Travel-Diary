import React, { useEffect, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import axiosInstance from '../../utils/axiosinstance';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) return setSuggestions([]);
      console.log("Fetching suggestions for:", value);
      try {
        const res = await axiosInstance.get(`/api/suggest-locations?q=${value}`);
        console.log("Full API Response:", res);
        console.log("Suggestions from API:", res.data.suggestions);
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [value]);

  return (
    <div className='relative w-80'>
      <div className='flex items-center px-4 bg-slate-100 rounded-md'>
        <input
          type='text'
          placeholder='Search Notes'
          className='w-full text-xs bg-transparent py-[11px] outline-none'
          value={value}
          onChange={onChange}
        />
        {value && (
          <IoMdClose
            className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3'
            onClick={onClearSearch}
          />
        )}
        <FaMagnifyingGlass
          className='text-slate-400 cursor-pointer hover:text-black'
          onClick={handleSearch}
        />
      </div>

      {/* Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <ul className='absolute top-full left-0 bg-white border w-full z-50 rounded shadow'>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => {
                onChange({ target: { value: s } });
                setSuggestions([]);
              }}
              className='px-4 py-2 text-sm hover:bg-cyan-100 cursor-pointer'
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
