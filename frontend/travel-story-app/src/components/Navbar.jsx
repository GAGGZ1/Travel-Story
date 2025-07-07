import React from "react";
import LOGO from "../assets/images/image111.png";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";

const Navbar = ({ userInfo, searchQuery, setSearchQuery,onSearchNote , handleClearSeach}) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    handleClearSeach();
    setSearchQuery("");
  };

  if (!userInfo) return null;

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10 h-16">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <img
          src={LOGO}
          alt="Travel Story"
          className="max-h-12 w-auto transform transition-transform duration-300 hover:scale-110 object-contain"
        />
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center">
        {isToken && (
          <div className="w-full max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>
        )}
      </div>

      {/* Right: Profile Info */}
      <div className="flex-shrink-0">
        {isToken && (
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
};

export default Navbar;