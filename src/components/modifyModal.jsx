import PropTypes from 'prop-types'
import { useStore,updateMilkHistory } from '../state'
import { useState,useRef, useEffect } from 'react'
export default function ModifyModal({id,volume,date,remarks,onClose}) {
  console.log('modify modal', id,volume,date,remarks)
  const {tags} = useStore()
  
  const dateInput = useRef()
  const volumeInput = useRef()
  const remarksInput = useRef()

  const [currentDate,setCurrentDate] = useState(date || Date.now())
  const [currentVolume,setCurrentVolume] = useState(volume || 0)
  const [currentRemarks,setCurrentRemarks] = useState(remarks || '母乳')

  useEffect(()=>{
    dateInput.current.value = currentDate
    volumeInput.current.value = currentVolume
    remarksInput.current.value = currentRemarks
  },[currentDate,currentVolume,currentRemarks])

  const handleConfirm = () => {
    updateMilkHistory(id,currentDate,currentVolume,currentRemarks)
    onClose&&onClose()
  }


  return <div className="fixed z-10 inset-0 bg-black/30 flex flex-col justify-center items-center">
    <div className='w-80vw bg-white rounded-md p-4 flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h3>修改记录</h3>

        <input ref={dateInput} onChange={(e)=>setCurrentDate(e.target.value)} type="datetime-local" className='p-2' defaultValue={currentDate}/>
      </div>
      <div>
        <div className='flex items-center gap-4'>
          <button className='p-2' onClick={() => setCurrentVolume(currentVolume - 10)}>-10ml</button>
          <input type="number" className='p-2' defaultValue={currentVolume} ref={volumeInput}/>
          <button className='p-2' onClick={() => setCurrentVolume(currentVolume + 10)}>+10ml</button>
        </div>
      </div>

      <div className='flex'>
        <input ref={remarksInput} className="flex-1 p-2" type="text" defaultValue={currentRemarks} />
        {
          tags.map((tag,index)=>{
            return <button onClick={()=>{
              setCurrentRemarks(tag)
            }} key={index} className='p-2 bg ml-2 bg-white'>{tag}</button>
          })
        }
      </div>

      <button onClick={handleConfirm} className='p-2 rounded-full bg-blue-500 text-white'>确认修改</button>
      <button onClick={()=> onClose&&onClose()} className='p-2 rounded-full bg-white'>取消</button>
    </div>
    
  </div> 
}

ModifyModal.propTypes = {
  id: PropTypes.number,
  volume: PropTypes.number,
  date: PropTypes.number,
  remarks: PropTypes.string,
  onClose: PropTypes.func,
}