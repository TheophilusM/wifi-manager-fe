import React from 'react'
import RingLoader from "react-spinners/RingLoader";

function Loading() {
  return (
    <div className='main-container-center'>
        <RingLoader loading={true} color={"#11aa11"} size={20} speedMultiplier={2}/>
    </div>
  )
}

export default Loading