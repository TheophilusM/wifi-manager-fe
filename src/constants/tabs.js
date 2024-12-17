import { roleGroups } from "./roles";
import { MdOutlineAccountTree } from "react-icons/md";

export const tabs = [
  {
    tabId: 1,
    iconID: 1,
    name: "Ecocash Accounts",
    path: "ecocash-accounts",
    hasArrow: false,
    level: roleGroups.HASANY,
  },
];

export const menuIcons = [
  { icon: <MdOutlineAccountTree className="tab-icon" />, iconID: 1 },
];

export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
