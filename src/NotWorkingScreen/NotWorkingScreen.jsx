import './NotWorkingScreen.scss'

const NotWorkingScreen = ({ windowWidth, windowHeight, widthCondition, heightCondition, safari }) => {

  return (
    <div className='wrapper-not-working'>
      Not working yo
      {
        safari &&
        <h1>Stop using Safari</h1>
      }
      {
        (widthCondition || heightCondition) &&
        <h1>Look at it on a better screen</h1>
      }
    </div>
  )
}

export default NotWorkingScreen