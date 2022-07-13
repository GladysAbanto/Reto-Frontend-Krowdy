import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import Home from './pages/Home';
import Detail from './pages/Detail';
import { AppContext } from './context/app.context';
import { VideosData } from "./data/videos.data";

function App() {
  const [videos, setVideos] = useState(VideosData);

  const dispatchVideoEvent = (actionType, payload) => {
    switch (actionType) {
      case 'GET_VIDEO':
        return videos.find(video => video.id == payload.id);
      case 'UPDATE_VIDEO':
        setVideos(videos.map(video => {
          if (video.id == payload.id) {
            video = payload;
          }
          return video;
        }));
        return;
      default:
        return;
    }
  };

  return (

    <BrowserRouter>
      <AppContext.Provider value={{ videos, dispatchVideoEvent }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter >
  );
}

export default App;
