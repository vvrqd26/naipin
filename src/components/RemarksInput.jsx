import { useRef } from 'react'
import { useStore,setRemarks } from '../state'
export default function RemarksInput() {
  const {currentRemarks,tags} = useStore()
  const inputRef = useRef(null)
  return <>
    <div className='my-1em flex'>
    <input ref={inputRef} type="text" className='p-2' placeholder='请输入备注' defaultValue={currentRemarks} />
      {
        tags.map((tag,index)=>{
          return <button onClick={()=>{
            setRemarks(tag)
            inputRef.current.value = tag
          }} key={index} className='p-2 bg ml-2 bg-white'>{tag}</button>
        })
      }
    </div>
  </>
}