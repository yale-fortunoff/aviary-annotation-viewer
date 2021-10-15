import React from 'react';
import style from './ToggleButton.module.css';

interface ToggleButtonProps {
  toggleFunc: () => void;
  active: boolean;
  // helpText: string;
  labelText: string;
}
export default function ToggleButton({
  toggleFunc,
  active,
  labelText,
}: ToggleButtonProps) {
  return (
    <button
      className={`${style.ToggleButton} ${
        active ? style.Active : style.Inactive
      }`}
      type="button"
      onClick={toggleFunc}
    >
      {labelText}
    </button>
  );
}
