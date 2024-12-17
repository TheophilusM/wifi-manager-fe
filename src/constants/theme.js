export const blueColor = "#061F4F";
export const redColor = "#E30B29";
export const whiteColor = "#061F4F";

export const formStyle = { 
    width : 360,
    borderTopLeftRadius: 10,
    borderTop: `6px solid ${blueColor}`,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
};

export const regFormStyle = { 
    ...formStyle,
    width : 700,
};

export const structure = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

export const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

export const paginationStyle = {
  width: 20,
  height: 20,
  fontSize: 12,
  color: "#a6a6a6",
  border: "1px solid lightgrey",
  borderRadius: 3,
  margin: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Annual Leave Progress',
    },
  },
};

export const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Annual Leave Progress',
    },
  },
};

export const detailStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.9)", paddingLeft: 20, marginBottom: 1}