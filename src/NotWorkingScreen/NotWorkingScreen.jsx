import './NotWorkingScreen.scss'
import BackgroundScreen from '../BackgroundScreen/BackgroundScreen'


const NotWorkingScreen = ({ windowWidth, windowHeight, widthCondition, heightCondition, safari }) => {

  return (
    <div className='wrapper-not-working'>
      {
        safari && !(widthCondition || heightCondition) &&
        <BackgroundScreen 
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          showBlobs={false}
          childrenComponent={
            <div className='wrapper-safari-condition condition'>
              <h2>Sorry :(</h2>
              <div className='explanation'>
                <p>Safari is not supported. Try Chrome, Edge or Firefox. Ideally one of the first two...</p>
              </div>
            </div>
          }
      />
      }
      {
        !safari && (widthCondition || heightCondition) &&
        <BackgroundScreen 
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          showBlobs={false}
          childrenComponent={
            <div className='wrapper-size-condition condition'>
              <h2>Sorry :(</h2>
              <div className='explanation'>
                <p>Only laptop & above screen sizes are supported. Try on a bigger screen.</p>
              </div>
            </div>
          }
        />
      }
      {
        safari && (widthCondition || heightCondition) &&
        <BackgroundScreen 
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          showBlobs={false}
          childrenComponent={
            <div className='wrapper-all-condition condition'>
              <h2>Sorry :(</h2>
              <div className='explanation'>
                <p>Safari is not supported. Try Chrome, Edge or Firefox. Ideally one of the first two...</p>
                <p>Only laptop & above screen sizes are supported. Try on a bigger screen.</p>
              </div>
            </div>
          }
        />
      }
    </div>
  )}

export default NotWorkingScreen