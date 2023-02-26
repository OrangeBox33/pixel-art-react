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
