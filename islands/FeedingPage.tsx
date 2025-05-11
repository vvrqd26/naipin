import { useEffect, useMemo, useState } from "preact/hooks";
import { LastFeedingInfo } from "./LastFeedingInfo.tsx";
import { FeedingRecord } from "../routes/api/feeding_records.ts";
import { FeedingHistory } from "./FeedingHistory.tsx";

export const FeedingPage = () => {
  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const totalVolume = useMemo(() => {
    if (!records || records.length === 0) {
      return 0;
    }
    return records.filter((item) => {
      // 过滤掉今天之前的记录
      return new Date(item.date).getDate() === new Date().getDate() &&
        new Date(item.date).getMonth() === new Date().getMonth() &&
        new Date(item.date).getFullYear() === new Date().getFullYear();
    }).reduce((acc, record) => {
      return acc + record.volume;
    }, 0);
  }, [records]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    fetch("/api/feeding_records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.data);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div class="px-4 py-8 mx-auto bg-[#86efac] w-full">
        <LastFeedingInfo
          lastRecord={records[0]}
          totalVolume={totalVolume}
        />
      </div>

      <div className="w-full p-2">
        <FeedingHistory records={records} fetchRecords={fetchRecords} />
      </div>
    </div>
  );
};
