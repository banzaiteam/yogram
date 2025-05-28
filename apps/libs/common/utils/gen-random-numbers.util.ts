export const genRandomNumbersString = async (length: number) => {
  let str = '';
  for (let i = 0; i < length; i++) {
    const numb = Math.floor(Math.random() * 9);
    str += numb;
  }
  return str;
};
