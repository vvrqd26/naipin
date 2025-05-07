import { useStore,removeMilkHistory } from '../state/index'
import moment from 'moment'
import PropTypes from 'prop-types'

const HistoryItem = ({date, milkVolume, remarks,index}) => {
  return (
    <tr >
      <td>{index}</td>
      <td className='py-2'>{moment(date).format('MM月DD日 h:mm:ss')} </td>
      <td>{milkVolume}ml</td>
      <td>{remarks}</td>
      <td className='' onClick={() => removeMilkHistory(index)}><button className='bg-red-400 text-white'>删除</button></td>
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

  return (
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
  )
}