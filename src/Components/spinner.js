import React, { Component } from 'react'
import loading from '../loading.gif'

export default class spinner extends Component {
  render() {
    return (
      <div>
        <div className='text-center'>
      <img src={loading} style={{height:"90px"}} alt='loading'></img>
    </div>
      </div>
    )
  }
}

