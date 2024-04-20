import './BackgroundScreen.scss'

const BackgroundScreen = ({ childrenComponent }) => {

  return (
    <div className='wrapper-bacgkround-screen'>
      <div className="video-background">
        <video autoPlay muted loop id="myVideo">
          <source src="./mammamia2.mp4" type="video/mp4" ></source>
          Your browser does not support HTML5 video.
        </video>
      </div>

      <div className="ryoo-bg5"></div>
      {childrenComponent}

      {/* <div className='loading-text'>
        Loading
        <div class="dot-pulse"></div>
      </div> */}
    </div>
  )
}

export default BackgroundScreen