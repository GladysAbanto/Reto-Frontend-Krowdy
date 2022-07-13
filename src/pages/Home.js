import React, { useContext, useState } from "react";
import { VideoQuiz } from "../components/VideoQuiz";
import { AppContext } from "../context/app.context";
import "./Home.css"

const Home = () => {
    const { videos } = useContext(AppContext);

    const renderVideosQuiz = () => {
        return videos.map((video, index) =>
            <VideoQuiz video={video} key={index}></VideoQuiz>
        )

    }

    return (
        <div className="home">
            <h1>Video Cuestionario</h1>
            <div className='home_container'>
                {renderVideosQuiz()}
            </div>
        </div>
    );
}

export default Home;