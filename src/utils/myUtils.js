export const palette = [
  { color: 'rgba(0, 0, 0, 1)', id: 'dasd' },
  { color: 'rgba(255, 0, 0, 1)', id: 'zxcsd' },
  { color: 'rgba(233, 30, 99, 1)', id: 'Mwk6YVUYon' },
  { color: 'rgba(156, 39, 176, 1)', id: 'lnbMLt2DY_' },
  { color: 'rgba(103, 58, 183, 1)', id: 'i4ZAm_g1eB' },
  { color: 'rgba(63, 81, 181, 1)', id: 'ujxIWvACBO' },
  { color: 'rgba(33, 150, 243, 1)', id: 'FdfHNd5B3-' },
  { color: 'rgba(3, 169, 244, 1)', id: 'OplCJN5iNF' },
  { color: 'rgba(0, 188, 212, 1)', id: 'dwvtp7L7hf' },
  { color: 'rgba(0, 150, 136, 1)', id: '6c8r17dvWo' },
  { color: 'rgba(76, 175, 80, 1)', id: 'p4ZRn86dt-' },
  { color: 'rgba(139, 195, 74, 1)', id: 'tgFVquKeCk' },
  { color: 'rgba(205, 220, 57, 1)', id: '90O0aLxtEr' },
  { color: 'rgba(158, 224, 122, 1)', id: 'rfKwtQxDtn' },
  { color: 'rgba(255, 235, 59, 1)', id: 'HTko3Zois-' },
  { color: 'rgba(255, 193, 7, 1)', id: 'FYe96brFt3' },
  { color: 'rgba(255, 152, 0, 1)', id: 'ICp0K5k7Lg1' },
  { color: 'rgba(255, 205, 210, 1)', id: 'pdFJn1TjzIi' },
  { color: 'rgba(255, 87, 34, 1)', id: 'bi3DHs0vyad' },
  { color: 'rgba(121, 85, 72, 1)', id: 'sl8RTPWYjr5' },
  { color: 'rgba(158, 158, 158, 1)', id: '_6c7qELZXGw' },
  { color: 'rgba(96, 125, 139, 1)', id: 'wzpEf6yfAdZ' },
  { color: 'rgba(48, 63, 70, 1)', id: 'IPw-JoW8oS-' },
  { color: 'rgba(255, 255, 255, 1)', id: 'IvBjmAB_I4I' },
  { color: 'rgba(255, 255, 255, 1)', id: 'kSoXxg3W-xE' },
  { color: 'rgba(56, 53, 53, 1)', id: 'W_jIgJBr-Hq' },
  { color: 'rgba(56, 53, 53, 1)', id: 'NmGZn7ZSqdC' },
  { color: 'rgba(56, 53, 53, 1)', id: 'asda' },
  { color: 'rgba(56, 53, 53, 1)', id: '5LWgHyvW6oF' },
  { color: 'rgba(56, 53, 53, 1)', id: 'sFC0J0vf_0P' }
];

export const transform = oldArr => {
  const formula = (x, y) => 32 * y + x;

  const arr = [];
  let x = 31;
  let y = 7;
  let odd = true;

  for (let i = 0; i < 256; i++) {
    arr[i] = oldArr[formula(x, y)];

    if (odd) {
      if (y === 0) {
        odd = false;
        x--;
      } else {
        y--;
      }
    } else {
      if (y === 7) {
        odd = true;
        x--;
      } else {
        y++;
      }
    }
  }

  x = 0;
  y = 8;
  odd = true;

  for (let i = 256; i < 512; i++) {
    arr[i] = oldArr[formula(x, y)];

    if (odd) {
      if (y === 15) {
        odd = false;
        x++;
      } else {
        y++;
      }
    } else {
      if (y === 8) {
        odd = true;
        x++;
      } else {
        y--;
      }
    }
  }

  x = 31;
  y = 23;
  odd = true;

  for (let i = 512; i < 768; i++) {
    arr[i] = oldArr[formula(x, y)];

    if (odd) {
      if (y === 16) {
        odd = false;
        x--;
      } else {
        y--;
      }
    } else {
      if (y === 23) {
        odd = true;
        x--;
      } else {
        y++;
      }
    }
  }

  x = 0;
  y = 24;
  odd = true;

  for (let i = 768; i < 1024; i++) {
    arr[i] = oldArr[formula(x, y)];

    if (odd) {
      if (y === 31) {
        odd = false;
        x++;
      } else {
        y++;
      }
    } else {
      if (y === 24) {
        odd = true;
        x++;
      } else {
        y--;
      }
    }
  }

  return arr;
};

export const createEmptyGrid = () => {
  const arr = [];

  for (let i = 0; i < 1024; i++) {
    arr[i] = [0, 0, 0];
  }

  return arr;
};

export const createStrGridFromArrGrid = arrGrid => {
  const strGrid = [];

  for (let i = 0; i < 1024; i++) {
    const rgbArr = arrGrid[i];

    strGrid[i] =
      rgbArr.reduce((acc, oneColor) => `${acc}${oneColor},`, 'rgba(') + '1)';
  }

  return strGrid;
};

export const createFrames = arrGrid => {
  const frames = [
    {
      grid: createStrGridFromArrGrid(arrGrid),
      interval: 100,
      key: ''
    }
  ];

  return frames;
};
