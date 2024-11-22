function moveZerosRightToLeft(array) {
  let a = [...array];
  let writePointer = a.length - 1;
  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] !== 0) {
      a[writePointer] = a[i];
      writePointer--;
    }
  }
  for (let i = writePointer; i >= 0; i--) {
    a[i] = 0;
  }
  return a;
}

function moveZerosLeftToRight(array) {
  let a = [...array];
  let writePointer = 0;
  for (let i = 0; i <= a.length - 1; i++) {
    if (a[i] !== 0) {
      a[writePointer] = a[i];
      writePointer++;
    }
  }
  for (let i = 1; i <= a.length - writePointer; i++) {
    a[a.length - i] = 0;
  }
  return a;
}

function summRightToLeft(array) {
  let a = [...array];
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== 0 && a[i + 1] !== 0) {
      const equal = a[i] === a[i + 1];
      if (equal) {
        const s = a[i] + a[i + 1];
        a[i + 1] = s;
        a[i] = 0;
        i++;
      }
    }
  }
  return a;
}

function summLeftToRight(array) {
  let a = [...array];
  for (let i = a.length - 1; i >= 0; i--) {
    if (a[i] !== 0 && a[i - 1] !== 0) {
      const equal = a[i] === a[i - 1];
      if (equal) {
        const s = a[i] + a[i - 1];
        a[i] = s;
        a[i - 1] = 0;
      }
    }
  }
  return a;
}

function summ(array, to = "Left") {
  const movedArray =
    to === "Left" ? moveZerosLeftToRight(array) : moveZerosRightToLeft(array);
  const doneArray =
    to === "Left" ? summRightToLeft(movedArray) : summLeftToRight(movedArray);
  return to === "Left"
    ? moveZerosLeftToRight(doneArray)
    : moveZerosRightToLeft(doneArray);
}

function getCols(matrix, index) {
  const a = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (j === index) {
        a.push(matrix[i][j]);
      }
    }
  }
  return a;
}

export { summ, getCols };
