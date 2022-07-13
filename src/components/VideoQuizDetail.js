import './VideoQuizDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from 'react';
import { secondsToTime } from '../util/time.util';
import { AppContext } from '../context/app.context';

let mediaRecorder;
let recordedBlobs;

const useTimer = (startTime) => {
    const [time, setTime] = useState(startTime)
    const [intervalID, setIntervalID] = useState(null)
    const hasTimerEnded = time >= 120
    const isTimerRunning = intervalID != null

    const update = () => {
        setTime(time => time + 1)
    }
    const startTimer = () => {
        if (!hasTimerEnded && !isTimerRunning) {
            setIntervalID(setInterval(update, 1000))
        }
    }
    const stopTimer = () => {
        clearInterval(intervalID)
        setIntervalID(null)
    }

    useEffect(() => {
        if (hasTimerEnded) {
            clearInterval(intervalID)
            setIntervalID(null)
        }
    }, [hasTimerEnded])

    useEffect(() => () => {
        clearInterval(intervalID)
    }, [])
    return {
        time,
        setTime,
        startTimer,
        stopTimer,
    }
}

export const VideoQuizDetail = (props) => {

    const navigate = useNavigate();
    const params = useParams();
    const { videos, dispatchVideoEvent } = useContext(AppContext);
    const [video, setVideo] = useState({})
    const [statusRecord, setStatusRecord] = useState('START_RECORDING');
    const [initButton, setInitButton] = useState(false);


    const [prev, setPrev] = useState('Atrás');
    const [next, setNext] = useState('');
    const [urlPrev, setUrlPrev] = useState('');
    const [urlNext, setUrlNext] = useState('');

    const { time, setTime, startTimer, stopTimer } = useTimer(0)

    useEffect(() => {
        setVideo(dispatchVideoEvent('GET_VIDEO', { id: params.id }))
        evalNavigationButtons();
    }, [urlPrev, urlNext])

    const evalNavigationButtons = () => {
        const MIN_VALUE = 1;
        const MAX_VALUE = videos.length;
        let { id } = params;
        id = parseInt(id); // A entero
        if ((id - 1) >= MIN_VALUE) {
            setUrlPrev('/detail/' + (id - 1));
        } else {
            setUrlPrev('/');
        }

        if ((id + 1) <= MAX_VALUE) {
            setUrlNext('/detail/' + (id + 1));
            setNext('Siguiente');
        } else {
            setUrlNext('/');
            setNext('Terminar');
        }
    }

    const _handleBackButton = () => {
        navigate('/'); // Inicio
    }

    function handleDataAvailable(event) {
        console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function startRecording() {
        recordedBlobs = [];
        const mimeType = "video/webm;codecs=vp9,opus";
        const options = { mimeType };

        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobs);
        };
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        console.log('MediaRecorder started', mediaRecorder);
    }

    function handleSuccess(stream) {
        console.log('getUserMedia() got stream:', stream);
        window.stream = stream;

        const gumVideo = document.querySelector('video#gum');
        gumVideo.srcObject = stream;
    }

    async function init(constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            console.error('navigator.getUserMedia error:', e);
        }
    }

    const _handleButtonRecord = async () => {
        if (statusRecord === 'START_RECORDING') {
            setStatusRecord('STOP_RECORDING')
            const constraints = {
                audio: {
                    echoCancellation: { exact: false }
                },
                video: {
                    width: 1280, height: 720
                }
            };
            await init(constraints);
            startRecording();
            setTime(0);
            startTimer();
            setInitButton(true);
        } else {
            setStatusRecord('START_RECORDING');
            stopRecording();
            setInitButton(false);
            stopTimer();
            // Actualizar el video grabado en la data
            updateVideo();
        }
    }

    const updateVideo = () => {
        video.status = "UPDATED";
        const mimeType = 'video/webm';
        const superBuffer = new Blob(recordedBlobs, { type: mimeType });
        video.src = window.URL.createObjectURL(superBuffer);
        dispatchVideoEvent('UPDATE_VIDEO', { video });
    }

    function stopRecording() {
        mediaRecorder.stop();
    }

    const evalIconVideo = () => {
        if (video && video.status === 'EMPTY') {
            return statusRecord === 'START_RECORDING' ? faPlay : faStop
        } else {
            return statusRecord === 'STOP_RECORDING' ? faStop : faRefresh;
        }
    }

    return (
        <div>
            <div className='back_container'>
                <FontAwesomeIcon className='icon_back' icon={faArrowLeft} color={'black'} size={'lg'} onClick={_handleBackButton}></FontAwesomeIcon>
                <span>Volver</span>
            </div>
            <div className="video_detail_container">
                <div className="video_detail_result">
                    <video id="gum" playsInline autoPlay muted></video>
                    <div className='video_time'>
                        <span>{secondsToTime(time)} / 2:00</span>
                        <div className={'icon_record ' + (initButton ? 'parpadea' : '')}></div>
                    </div>
                    <button className='detail_button_play' onClick={_handleButtonRecord}>
                        <FontAwesomeIcon icon={evalIconVideo()} color={'white'}></FontAwesomeIcon>
                    </button>
                </div>
                <div className="video_detail_footer">
                    <p>{video.question}</p>
                </div>
            </div >
            <div className='navigation_buttons'>
                <a onClick={() => { window.location.href = urlPrev }} >{prev}</a>
                <a onClick={() => { window.location.href = urlNext }} >{next}</a>
            </div>
        </div >
    )
}