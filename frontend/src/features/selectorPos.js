import { createSelector } from '@reduxjs/toolkit';
import { posSelector } from './posSlice';

export const selectPosByMenuId = (state, menuId) => {
    const allPos = posSelector.selectAll(state);
    console.log("isi alpoos " + allPos)

  if (!allPos) {
    return null;
  }

  console.log("menuId " + menuId );
  const pos = allPos.find((pos) => pos.menuId === menuId);
  console.log("hasilnya " + pos );

  return pos ? pos : null;;
};

export const selectAllPos = (state) => state.pos.entities;
