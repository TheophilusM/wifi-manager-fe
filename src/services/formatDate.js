import { months } from "../constants/tabs";
import { capitalize } from "./capitalize";

export const formatDate = (stringVal) => {
  var dateArray = stringVal?.split("-");
  return dateArray[2]?.substring(0,2) + " " + capitalize(months[+dateArray[1]])?.substring(0,3) + " " + dateArray[0];
};
