export class SourceListModel {
   id!: number;
   name!: string;
}
export class GlobalSettingStoreModel {
   showImage!: boolean;
   sourceList!: SourceListModel[];
   selectedSource!: SourceListModel
   subTitle!: string;
   showToast!: boolean;
   toastMessage!: string;
}
const sourceList: SourceListModel[] = [
   {
      "id": 1,
      "name": "漫畫聯合國"
   },
   {
      "id": 2,
      "name": "禁漫天堂"
   },
   {
      "id": 3,
      "name": "韓國漫畫"
   }
]
export const initialGlobalSettingStore: GlobalSettingStoreModel = {
   showImage: true,
   sourceList: sourceList,
   selectedSource: sourceList[0],
   subTitle: '',
   showToast: false,
   toastMessage: ''
};
export const globalSettingStore = "globalSettingStore"