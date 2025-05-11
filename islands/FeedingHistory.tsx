import moment from "npm:moment";
import { useCallback, useEffect, useState } from "preact/hooks";
import { FeedingRecord } from "../routes/api/feeding_records.ts";
import { ModifyFeedingRecordModal } from "./ModifyFeedingRecordModal.tsx";
import { Signal, useSignal } from "@preact/signals";
export const FeedingHistory = (
  { fetchRecords, records }: {
    fetchRecords: () => void;
    records: FeedingRecord[];
  },
) => {
  const [modifyRecord, setModifyRecord] = useState<FeedingRecord>();
  const showModifyModal = useSignal(false);

  useEffect(() => {
    fetchRecords();
  }, [showModifyModal.value]);

  const removeRecord = useCallback((id: string) => {
    return fetch("/api/feeding_records", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }).then((res) => {
      if (res.status === 200) {
        fetchRecords();
      }
    });
  }, []);

  const addRecord = () =>
    fetch("/api/feeding_records", {
      method: "POST",
      body: JSON.stringify({
        volume: 120,
        tags: "母乳",
      }),
    }).then((res) => {
      if (res.status === 200) {
        fetchRecords();
      }
    });
  return (
    <>
      <div className="w-full p-2 flex justify-between items-center">
        <div className="font-semibold text-xl">
          喂养记录
        </div>
        <button
          type="button"
          className="btn p-2 bg-black text-white rounded-full px-4"
          onClick={addRecord}
        >
          +
        </button>
      </div>
      <table className="w-full">
        <tbody>
          {records.map((record) => {
            return (
              <tr key={record.id}>
                <td>{moment(record.date).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>{record.volume}</td>
                <td>{record.tags}</td>
                <td className="flex gap-4">
                  <button
                    type="button"
                    className="text-blue-500"
                    onClick={() => {
                      setModifyRecord(record);
                      showModifyModal.value = true;
                    }}
                  >
                    修改
                  </button>
                  <button
                    onClick={() => removeRecord(record.id)}
                    type="button"
                    className="text-red-500"
                  >
                    删除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ModifyFeedingRecordModal
        record={modifyRecord}
        showModal={showModifyModal}
      />
    </>
  );
};
