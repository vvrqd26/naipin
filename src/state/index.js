import { create } from "zustand";
import { addMilkHistoryToDb } from "../db";
import { getMilkHistoryFromDb, removeMilkHistoryFromDb,updateMilkHistoryToDb } from "../db";

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
  useStore.setState({ currentRemarks: remarks })
}
export const addMilkHistory = (volume, remarks) => {
  console.log('addMilkHistory参数:', { volume, remarks });
  addMilkHistoryToDb(
    volume,
    remarks
  ).then(()=> {
    syncDb()
  })
}
export const updateMilkHistory = (id, date,volume, remarks) => {
  updateMilkHistoryToDb(id, date,volume, remarks).then(()=> {
    syncDb()
  }).catch((err) => {
    console.log('updateMilkHistory err:', err);
  })
}
export const removeMilkHistory = (id) => {
  removeMilkHistoryFromDb(id).then(()=> {
    syncDb()
  })
}

// 获取今日总奶量
export const todayTotalMilkVolume = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayMilkHistory = useStore.getState().milkHistory.filter((item) => {
    const date = new Date(item.date).toISOString().split('T')[0];
    return date === today;
  });
  return todayMilkHistory.reduce((acc, item) => acc + item.volume, 0);
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
      currentMilkVolume: last?.volume ?? 0,
      currentRemarks: last?.remarks ?? '母乳',
    })
  });
}