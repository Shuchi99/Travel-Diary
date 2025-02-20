import React from 'react'

import LOGO from "../assets/images/logo.svg";
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './input/SearchBar';

const Navbar = ({userInfo, searchQuery, setSearchQuery,onSearchNote,handleClearSearch}) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
      if (searchQuery){
        onSearchNote(searchQuery);
      }
    };
    const onClearSearch = () => {
      handleClearSearch();
      setSearchQuery("");
    };

  return (
    <div className='bg-white flex flex-wrap items-center justify-between px-4 py-2 drop-shadow sticky top-0 z-10'>
      <img src={LOGO} alt="travel diary" className='h-10 w-auto'></img>
      { isToken && <> 
        <div className="flex-1 flex justify-center mx-2">
      <SearchBar value={searchQuery} onChange={({target}) => {
        setSearchQuery(target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}></SearchBar>
      </div>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}></ProfileInfo>{" "} 
      </>}
    </div>
  )
}

export default Navbar
