import './VideoQuiz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"

export const VideoQuiz = (props) => {

    const { video } = props;

    const navigate = useNavigate();

    const _handleClickVideo = () => {
        navigate(`/detail/${video.id}`);
    }

    return (
        <div className="video_container" onClick={_handleClickVideo}>
            <div className="video_result">
                <video src={video.src ? video.src : ''}></video>
                <button className='button_play'>
                    <FontAwesomeIcon icon={faPlay} color={'white'}></FontAwesomeIcon>
                </button>
            </div>
            <div className="video_footer">
                <p>{video.question}</p>
            </div>
        </div >
    )
}