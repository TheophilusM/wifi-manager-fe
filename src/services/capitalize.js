export const capitalize = (stringVal) => {
  const arr = stringVal?.split(" ");
  for (var i = 0; i < arr?.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].toLowerCase().slice(1);
  }
  const sortedString = arr?.join(" ");
  return sortedString;
};
