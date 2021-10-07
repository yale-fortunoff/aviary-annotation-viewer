import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import style from './Dropdown.module.css';

interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: Array<DropdownItem>;
  labelText: string;
  currentItemID: string;
  changeFunc: (id: string) => void;
}

export default function Dropdown({
  currentItemID,
  items,
  labelText,
  changeFunc,
}: DropdownProps) {
  const [selectID] = useState<string>(`dropddown-select-${uuid()}`);

  return (
    <div className={style.Dropdown}>
      <label htmlFor={selectID}>{labelText}</label>
      <select
        id={selectID}
        defaultValue={currentItemID}
        onChange={(evt) => {
          changeFunc(evt.target.value);
        }}
      >
        {items.map((item: DropdownItem) => {
          const { id, label } = item;
          return (
            <option key={id} value={id}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
