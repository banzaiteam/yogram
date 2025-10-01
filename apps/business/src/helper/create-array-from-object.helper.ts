export const createObjectFromArrayReduce = (arr: any) => {
  for (let i = 1; i < arr.length; i++) {
    arr[i] = arr[i].reduce((acc, current, index, array) => {
      if (index % 2 === 0 && index + 1 < array.length) {
        acc[current] = array[index + 1];
      } else if (index % 2 === 0 && index + 1 >= array.length) {
        acc[current] = undefined;
      }
      return acc;
    }, {});
  }
  return arr;
};
