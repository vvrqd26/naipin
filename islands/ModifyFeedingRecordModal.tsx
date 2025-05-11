import { Signal } from "@preact/signals";
import { FeedingRecord } from "../routes/api/feeding_records.ts";
import { useEffect, useRef, useState } from "preact/hooks";

export function ModifyFeedingRecordModal(
  { record, showModal }: { record?: FeedingRecord; showModal: Signal<boolean> },
) {
  const dateInput = useRef<HTMLInputElement>(null);
  const volumeInput = useRef<HTMLInputElement>(null);
  const [feedingTags, setFeedingTags] = useState<string>(
    record?.tags || "母乳",
  );

  useEffect(() => {
    console.log("record", record);
    // if (record && dateInput.current) {
    // }
    if (record && volumeInput.current) {
      volumeInput.current.value = record.volume.toString();
    }
  }, [record]);

  if (!showModal.value || !record) {
    return null;
  }

  const modifyRecord = async () => {
    const date = new Date(dateInput.current?.value || "");
    const volume = Number(volumeInput.current?.value || "");
    const tags = feedingTags;

    const response = await fetch(`/api/feeding_records`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          id: record.id,
          date: new Date(date).getTime(),
          volume,
          tags,
        },
      ),
    });

    return response.json();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
      <div className="w-full px-2 py-4 bg-white rounded-lg flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold mb-2">修改喂养记录</h2>
          <input
            ref={dateInput}
            type="datetime-local"
            defaultValue={new Date(record.date).toISOString().split(".")[0]}
          />
        </div>

        <div className="flex border border-black rounded-md">
          <button
            type="button"
            className="btn px-2"
            onClick={() => {
              if (volumeInput.current) {
                volumeInput.current.value =
                  (parseInt(volumeInput.current.value) + 10).toString();
              }
            }}
          >
            +10ml
          </button>
          <input
            className="flex-1 p-2 border-x border-black"
            type="text"
            placeholder="请输入喂养量(ml)"
            ref={volumeInput}
          />
          <button type="button" className="btn p-2 ">-10ml</button>
        </div>
        <div className="flex justify-between">
          {[30, 60, 90, 120, 150, 180].map((item) => {
            return (
              <button
                key={item}
                type="button"
                className="btn p-2 border border-black rounded-md "
                onClick={() => {
                  if (volumeInput.current) {
                    volumeInput.current.value = item.toString();
                  }
                }}
              >
                {item}ml
              </button>
            );
          })}
        </div>
        <div className="flex mt-4 gap-4">
          <button
            type="button"
            className={"flex-1 p-2 border border-black rounded-md " +
              (feedingTags === "母乳" ? "bg-black text-white" : "")}
            onClick={() => {
              setFeedingTags("母乳");
            }}
          >
            母乳
          </button>
          <button
            type="button"
            className={"flex-1 p-2 border border-black rounded-md " +
              (feedingTags === "奶粉" ? "bg-black text-white" : "")}
            onClick={() => {
              setFeedingTags("奶粉");
            }}
          >
            奶粉
          </button>
        </div>
        <button
          type="button"
          className="bg-black text-white p-2 mt-4 rounded-md"
          onClick={() => {
            modifyRecord().then(() => {
              showModal.value = false;
            });
          }}
        >
          确认
        </button>
        <button
          type="button"
          className="border border-black p-2  rounded-md"
          onClick={() => {
            showModal.value = false;
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}
