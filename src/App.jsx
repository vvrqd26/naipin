import './App.css'
import LastMilk from './components/LastMilk'
import MilkHistory from './components/MilkHistory'
import MilkVolumeInput from './components/MilkVolumeInput'
import RemarksInput from './components/RemarksInput'
import { addMilkHistory,useStore } from './state'
function App() {
  const {currentMilkVolume,currentRemarks} = useStore()
  return (
    <div className='flex flex-col w-screen h-screen  items-center'>
      <LastMilk />
      <div className='flex flex-col justify-center items-center'>
        <MilkVolumeInput />
        <RemarksInput />
        <button onClick={() => {
            // 强制状态更新后再执行
            setTimeout(() => addMilkHistory(currentMilkVolume, currentRemarks), 0)
        }} className='rounded-full w-80vw py-2 bg-yellow-300 text-3xl'>
          喂奶
        </button>
      </div>
      <div className='flex-1 py-4 overflow-y-scroll'>
        <MilkHistory/>
      </div>
    </div>
  )
}

export default App
