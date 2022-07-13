import React, { useState } from "react";
import { VideoQuizDetail } from "../components/VideoQuizDetail";
import "./Detail.css"

const Detail = (props) => {

    return (
        <div className="detail">
            <div className='detail_container'>
                <VideoQuizDetail></VideoQuizDetail>
            </div>
        </div>
    );
}

export default Detail;