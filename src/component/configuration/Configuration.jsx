import React from 'react';
import './Config.css'

const Configuration = () => {
  return (
    <div className='config-main-container'>
      <h1>Groupement</h1>
       <div className='config-container'>
          <input type ='text' placeholder='nom' />
          <input type='text' placeholder='type'/>
          <input type='text' placeholder='code' />
          <input type='text' placeholder='adresse' />
          <input type='tel' placeholder='telephone' />
          <input type='text' placeholder='email' />
          <button>submit</button>
       </div>
    </div>
  )
}

export default Configuration
