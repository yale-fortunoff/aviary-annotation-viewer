import React from 'react';

interface DropdownItem {
  id: string;
  label: string;
}

interface DropdownProps {
  items: Array<DropdownItem>;
  currentItemID: string;
  changeFunc: (id: string) => void;
}

export default function Dropdown({
  currentItemID,
  items,
  changeFunc,
}: DropdownProps) {
  return (
    <select
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
  );
}
