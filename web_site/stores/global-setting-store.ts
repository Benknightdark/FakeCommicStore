const sourceList = [{
   "id": 1,
   "name": "漫畫聯合國"
}, {
   "id": 2,
   "name": "禁漫天堂"
}]
export const initialGlobalSettingStore = {
   showImage: true,
   sourceList: sourceList  as any,
   selectedSource: sourceList[0] as any
} as any;
export const globalSettingStore = "globalSettingStore"