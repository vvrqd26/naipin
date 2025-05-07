import moment from "moment"
import { lastMilkHistory,todayTotalMilkVolume } from '../state'
import { useState,useEffect } from "react"

export default function LastMilk() {
  const [fromLastMilkHistory, setFromLastMilkHistory] = useState('')
  useEffect(() => {
    
    const timer = setInterval(() => {
      if (!lastMilkHistory()) {
        setFromLastMilkHistory('')
        return
      }
      const lastDate = lastMilkHistory().date || new Date()
      setFromLastMilkHistory(
        '距离上次喂奶:'
        + moment(Date.now()).diff(moment(lastDate), 'hours')
        + '小时'
        + moment(Date.now()).diff(moment(lastDate), 'minutes') % 60
        + '分'
        + moment(Date.now()).diff(moment(lastDate), 'seconds') % 60
        + '秒'
      )
    })

    return () => {
      clearInterval(timer)
    }
  },[setFromLastMilkHistory])


  return (
    <div className='py-8  font-bold text-xl text-red  items-center justify-center text-center'>
      
      <div>当前时间:{
        moment(Date.now()).format('MM月DD日 HH:mm:ss')}
      </div>
      <div>        {
          lastMilkHistory ? (
            <div>
               {fromLastMilkHistory}
            </div>
          ):<></>
        }
      </div>
      <div>今日总奶量:{todayTotalMilkVolume()}ML</div>
    </div>
  )
}