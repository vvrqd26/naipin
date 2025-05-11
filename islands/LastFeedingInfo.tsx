import { useEffect, useMemo, useState } from "preact/hooks";
import moment from "npm:moment";
import { FeedingRecord } from "../routes/api/feeding_records.ts";

export const LastFeedingInfo = ({ lastRecord, totalVolume }: {
  lastRecord: FeedingRecord;
  totalVolume: number;
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const lastFromNow = useMemo(() => {
    if (!lastRecord || !lastRecord.date) {
      return "无";
    }
    return moment(currentTime).diff(moment(lastRecord.date), "hours") + "小时" +
      moment(currentTime).diff(moment(lastRecord.date), "minutes") % 60 +
      "分钟" +
      moment(currentTime).diff(moment(lastRecord.date), "seconds") % 60 + "秒";
  }, [lastRecord]);

  return (
    <div className={`flex flex-col items-center justify-center`}>
      <h3>当前时间:{moment(currentTime).format("YYYY-MM-DD HH:mm:ss")}</h3>
      <h3>
        距离上次喂食:{lastFromNow}
      </h3>
      <h3>今日总喂养量:{totalVolume}ml</h3>
    </div>
  );
};
