/* eslint-disable header/header */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

const randomColorArray = [
  '#FEE05F',
  '#F5836B',
  '#EE6C89',
  '#ff7997',
  '#397893',
  '#f48fb1',
  '#397893',
  '#F0512A',
  '#ff80ab',
  '#ff4081',
  '#ce93d8',
  '#ba68c8',
  '#ab47bc',
  '#ea80fc',
  '#5c6bc0',
  '#3f51b5',
  '#8c9eff',
  '#AF71AF',
  '#966EAC',
  '#91a7ff',
  '#738ffe',
  '#ECCCDB',
  '#6889ff',
  '#4d73ff',
  '#80deea',
  '#FFA800',
  '#26c6da',
  '#00bcd4',
  '#84ffff',
  '#D6234A',
  '#00e5ff',
  '#80cbc4',
  '#4db6ac',
  '#26a69a',
  '#009688',
  '#F78D53',
  '#1de9b6',
  '#00bfa5',
  '#72d572',
  '#42bd41',
  '#397893',
  '#a2f78d',
  '#e6ee9c',
  '#dce775',
  '#d4e157',
  '#ffee58',
  '#B24594',
  '#ffd54f',
  '#ffca28',
  '#FFBB50',
  '#397893',
  '#9195C9',
  '#ffcc80',
  '#ffb74d',
  '#ffa726',
  '#ffd180',
  '#ffab40',
  '#ff9100',
  '#FF5A5A',
  '#ffab91',
  '#ff8a65',
  '#ff9e80',
  '#ff6e40',
  '#bcaaa4',
  '#a1887f',
  '#8d6e63',
  '#90a4ae',
  '#78909c',
  '#607d8b'
];

function hashStr(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    hash += str.charCodeAt(i);
  }

  return hash;
}

const generateRandomColor = (str: string) => {
  if (str == null || str?.trim() === '') {
    return randomColorArray[
      Math.floor(Math.random() * randomColorArray.length)
    ];
  }

  const index = hashStr(str) % randomColorArray.length;

  return randomColorArray[index];
};

export const getShortAddress = (address: string) => address.substring(0, 6) + '...' + address.substring(address.length - 5);

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

export default generateRandomColor;
