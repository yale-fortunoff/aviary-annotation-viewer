import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import style from './Dropdown.module.css';

interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: Array<DropdownItem>;
  labelText?: string;
  currentItemID: string;
  changeFunc: (id: string) => void;
}

Dropdown.defaultProps = {
  labelText: undefined,
};

export default function Dropdown({
  currentItemID,
  items,
  labelText,
  changeFunc,
}: DropdownProps) {
  const [selectID] = useState<string>(`dropddown-select-${uuid()}`);

  // if there's only one item, don't render anything
  if (items.length < 2) {
    return <></>;
  }

  return (
    <div className={style.Dropdown}>
      {labelText ? <label htmlFor={selectID}>{labelText}</label> : null}
      <select
        id={selectID}
        value={currentItemID}
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
