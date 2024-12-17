import React from "react";
import { TbListSearch } from "react-icons/tb";

function EmptyTable() {
  return (
    <div
      style={{
        width: "100%",
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgba(0,0,0,0.3)",
        borderTop: "none",
      }}
    >
      <TbListSearch style={{ fontSize: 20, color: "#292929c7" }} />
    </div>
  );
}

export default EmptyTable;
