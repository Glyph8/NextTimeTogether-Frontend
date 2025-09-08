import { useState, useCallback } from 'react';

export function useSelection(initialState = new Set<number>()) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(initialState);

  const toggleItem = useCallback((id: number) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []); 

  return { selectedItems, toggleItem };
}