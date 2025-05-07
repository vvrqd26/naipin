import { create } from "zustand";
import { addMilkHistoryToDb } from "../db";
import { getMilkHistoryFromDb, removeMilkHistoryFromDb } from "../db";

export const useStore = create(() => ({
  currentMilkVolume: 90,
  currentRemarks: "母乳",
  milkHistory: [],
  tags: ['母乳', '奶粉'],
}))

export const setMilkVolume = (volume) => {
  useStore.setState({ currentMilkVolume: volume })
}
export const setRemarks = (remarks) => {
  console.log("setRemarks", remarks)
  useStore.setState({ currentRemarks: remarks })
}
export const addMilkHistory = () => {
  addMilkHistoryToDb(
    useStore.getState().currentMilkVolume,
    useStore.getState().currentRemarks
  ).then(()=> {
    syncDb()
  })
}
export const removeMilkHistory = (id) => {
  removeMilkHistoryFromDb(id).then(()=> {
    syncDb()
  })
}

export const lastMilkHistory = () => {
  return useStore.getState().milkHistory[useStore.getState().milkHistory.length - 1]
}

// 同步数据库
export const syncDb = () => {
  // 从数据库中获取 milkHistory
  getMilkHistoryFromDb().then((milkHistory) => {
    useStore.setState({ milkHistory });
    const last = milkHistory[milkHistory.length - 1]
    useStore.setState({
      currentMilkVolume: last?.volume,
      currentRemarks: last?.remarks,
    })
  });
}