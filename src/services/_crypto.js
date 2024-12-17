import { AES, enc } from "crypto-js";
var key = "p3iIDojaTYk1ylGjG3uqpNnXvdTmL6nH";

export const encrypt = (value) => {
  return AES.encrypt(value, key).toString();
};

export const decrypt = (value) => {
  if (!value) {
    return '';
  }
  return AES.decrypt(value, key).toString(enc.Utf8);
};
