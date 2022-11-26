import React from 'react'
import '../../App.css'

export default function ModalFinal({
  id = 'bgmodal',
  onClose = () => {},
  children
}) { 

  const handleOutSideClick = e => {
    if (e.target.id === id) onClose()
  }

  return (
    <div id={id} className="modal" onClick={handleOutSideClick}>
      <div className="containermodal-cep">        
        <div className="containermodal-cep">{children}</div>
      </div>
    </div>
  )
}
