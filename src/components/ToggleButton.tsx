import React from 'react';

interface ToggleButtonProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isDark, toggleTheme }) => {
  return (
    <label className="relative inline-block w-[3.5em] h-[2em] text-[17px]">
      <input 
        type="checkbox" 
        className="opacity-0 w-0 h-0 peer"
        checked={isDark}
        onChange={toggleTheme}
      />
      <span className="absolute cursor-pointer inset-0 bg-[#9fccfa] rounded-full transition-all duration-400 peer-checked:bg-[#0974f1] peer-focus:shadow-[0_0_1px_#0974f1]"></span>
      <span className="absolute content-[''] h-[2em] w-[2em] left-0 bottom-0 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-400 flex items-center justify-center peer-checked:translate-x-[1.5em]"></span>
    </label>
  );
};

export default ToggleButton;
