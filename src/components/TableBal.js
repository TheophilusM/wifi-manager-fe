import React from "react";

function TableBal({ first, title, value, bold }) {
  return (
    <tr className={`tr no-line ${first ? "first-tr" : ""}`}>
      <td className={first ? "td-no-line-first bold-row" : "td-no-line"}></td>
      <td className="td-no-line"></td>
      <td className="td-no-line"></td>
      <td className={bold ? "bold-row" : ""}>{title}: </td>
      <td className={bold ? "bold-row" : ""} style={{ textAlign: "right" }}>
        {value}
      </td>
    </tr>
  );
}

export default TableBal;
