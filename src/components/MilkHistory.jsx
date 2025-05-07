import { useStore,removeMilkHistory } from '../state/index'
import moment from 'moment'
import PropTypes from 'prop-types'
import ModifyModal from './modifyModal'
import { create } from 'zustand'

const useModalStore = create((set) => ({
  isShow: false,
  needModifyData: {},
  onClose: () => set({ isShow: false }),
  showModal: (needModifyData) => set({ isShow: true, needModifyData })
}))

const HistoryItem = ({date, milkVolume, remarks,index}) => {
  const {showModal} = useModalStore()

  return (
    <tr >
      <td className='py-2 text-gray-700'>{moment(date).format('MM月DD日 h:mm:ss')} </td>
      <td className='text-orange font-800 text-xl px-2'>{milkVolume}ml</td>
      <td className='text-white font-500 px-2'>{remarks}</td>
      <td className='flex gap-4 items-center pt-0.4em'>
        <button onClick={() => showModal({
          id: index,
          date,
          volume: milkVolume,
          remarks,
        })} className='bg-blue-400 text-white'>修改</button>
        <button onClick={() => removeMilkHistory(index)} className='bg-red-400 text-white'>删除</button>
      </td>
    </tr>
  )
}
HistoryItem.propTypes = {
  index: PropTypes.number,
  date: PropTypes.number,
  milkVolume: PropTypes.number,
  remarks: PropTypes.string
}


export default function MilkHistory() {
  const {milkHistory} = useStore()
  const {isShow, onClose, needModifyData} = useModalStore()

  return (
    <>
      {
        isShow && <ModifyModal {...needModifyData} onClose={onClose} />
      }
      <table className='w-full'>
        <tbody>
          {milkHistory.sort((a,b)=> b.date - a.date).map(
          (item) => {
              return <HistoryItem 
                index={item.id}
                key={item.id} 
                date={item.date} 
                milkVolume={item.volume} 
                remarks={item.remarks} />
            }
          )}
        </tbody>
      </table>
    </>
  )
}