import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";

const Dropdown = ({ handleDelete, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      <div>
        <span
          type="button"
          className="inline-flex justify-center w-full rounded-full p-2 transition duration-200 hover:scale-110 text-sm font-medium text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          id="options-menu"
          onClick={toggleDropdown}
        >
          <FaEllipsisH />
        </span>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div
            className={`py-1 ${disabled ? " cursor-not-allowed" : ""}`}
            role="none"
          >
            <a
              href="#"
              className={`${disabled ? "cursor-not-allowed pointer-events-none" : ""} block px-4 py-2 text-sm text-green-700 hover:bg-green-100 hover:text-green-900`}
              role="menuitem"
              onClick={() => {
                closeDropdown();
                handleDelete();
              }}
            >
              Delete
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
