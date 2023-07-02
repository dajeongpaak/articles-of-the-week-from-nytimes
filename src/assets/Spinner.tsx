import spinner from '../assets/spinner.gif'

function Spinner() {
  return (
  <div style={{display: 'flex', width: '100vw', height:'50vh'}}>
    <img 
      src={spinner} 
      alt='Loading...' 
      style={{ width: '50px', margin: 'auto', display: 'block'}}
    />
  </div>
  )
}

export default Spinner
