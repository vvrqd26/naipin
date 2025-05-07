import { useStore,setMilkVolume } from '../state'
import { useRef } from 'react'
export default function MilkVolumeInput() {
  const {currentMilkVolume} = useStore()
  const inputRef = useRef(null)
  function setCurrentMilkVolume(volume) {
    setMilkVolume(volume)
    inputRef.current.value = volume
  }

  return <>
          <div className='flex items-center justify-around w-full h-40px mb-1em'>
          <button className='p-2' onClick={() => setCurrentMilkVolume(currentMilkVolume - 10)} >-10ml</button>
          <input ref={inputRef} type="number" className='p-2 mx-2' placeholder='请输入奶量' defaultValue={currentMilkVolume} />
          <button className='p-2' onClick={() => setCurrentMilkVolume(currentMilkVolume + 10)} >+10ml</button>
        </div>
        <div className='w-full flex mb-1em'>
          <label htmlFor="" className='mr-1em'>快速选择</label>
          <div className='flex gap-1'>
            <button onClick={() => setCurrentMilkVolume(30)} >
              30ml
            </button>
            <button onClick={() => setCurrentMilkVolume(60)}>
              60ml
            </button>
            <button onClick={() => setCurrentMilkVolume(90)}>
              90ml
            </button>
            <button onClick={() => setCurrentMilkVolume(120)}>
              120ml
            </button>
          </div>
        </div>
  </>
}