import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store"
import useSWR from "swr";

export const useGlobalData=()=>{
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    return {
        globalStoreData:globalStoreData!,
        mutateGlobalStoreData:mutateGlobalStoreData!
    }
}