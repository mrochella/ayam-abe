import { createSelector } from '@reduxjs/toolkit';
import { cartSelector } from './cartSlice';

export const selectPosByMenuId = (state, menuId) => {
  const allPos = cartSelector.selectAll(state);

  if (!allPos) {
    return null;
  }

  console.log("menuId " + menuId);
  const pos = allPos.find((pos) => pos.menuId === menuId);
  console.log("hasilnya " + pos);

  return pos || null;
};

export const selectAllCart = (state) => cartSelector.selectAll(state);
