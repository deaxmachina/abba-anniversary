import './LoadingScreen.scss'
import BackgroundScreen from '../BackgroundScreen/BackgroundScreen'

const LoadingScreen = () => {

  return (
    <BackgroundScreen 
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