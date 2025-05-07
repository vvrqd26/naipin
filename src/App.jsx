import './App.css'
import LastMilk from './components/LastMilk'
import MilkHistory from './components/MilkHistory'
import MilkVolumeInput from './components/MilkVolumeInput'
import RemarksInput from './components/RemarksInput'
import { addMilkHistory } from './state'
function App() {
  return (
    <div className='flex flex-col w-screen h-screen  items-center'>
      <LastMilk />
      <div className='flex flex-col justify-center items-center'>
        <MilkVolumeInput />
        <RemarksInput />
        <button onClick={()=>addMilkHistory()} className='rounded-full w-200px h-200px bg-yellow-300 text-3xl'>
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
