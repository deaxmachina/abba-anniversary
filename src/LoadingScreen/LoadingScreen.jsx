import './LoadingScreen.scss'
import BackgroundScreen from '../BackgroundScreen/BackgroundScreen'

const LoadingScreen = ({ windowWidth, windowHeight }) => {

  return (
    <BackgroundScreen 
      windowWidth={windowWidth}
      windowHeight={windowHeight}
      childrenComponent={
        <div className='loading-text'>
          Loading
          <div class="dot-pulse"></div>
        </div>
      }
    />
  )
}

export default LoadingScreen