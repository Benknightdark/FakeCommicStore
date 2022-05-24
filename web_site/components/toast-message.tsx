import { AiFillCloseCircle } from "react-icons/ai";
import useSWR from "swr";
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store";
import { useEffect } from 'react';

const ToastMessage = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    useEffect(() => {
        if (globalStoreData.showToast) {
            setTimeout(() => {
                mutateGlobalStoreData({
                    ...globalStoreData,
                    showToast: false, toastMessage: ''
                }, false)
            }, 1000)
        }
    }, [globalStoreData, mutateGlobalStoreData])
    return (
        <div className="w-screen h-screen absolute bg-transparent">
            <div className="absolute top-5 right-5 left-0 sm:left-auto w-full grid justify-center px-4 sm:absolute">
                <div className="space-y-2 left-0 sm:left-auto w-full grid justify-center sm:justify-end px-4 absolute sm:right-0">
                    <div className="min-h-[16] w-80 px-4 py-2 bg-white rounded-md shadow-lg border border-gray-200 sm:right-0
                    z-50
                    ">
                        <div className="flex space-x-2 text-green-500 justify-between">
                            {globalStoreData.toastMessage}
                            <AiFillCloseCircle className="w-6 h-6 cursor-pointer"
                                onClick={() => {
                                    mutateGlobalStoreData({
                                        ...globalStoreData,
                                        showToast: false, toastMessage: ''
                                    }, false)
                                }}
                            ></AiFillCloseCircle>
                        </div>
                    </div>
                    {/* <div className="min-h-[16] w-80 px-4 py-2 bg-white rounded-md shadow-lg border border-gray-200 sm:right-0">
                        <div className="flex space-x-2 text-red-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Failed to create account
                        </div>
                        <div className="text-red-700 max-w-xs">Lorem ipsum dolor sit amet.</div>
                    </div>
                    <div className="min-h-[16] w-80 px-4 py-2 bg-white rounded-md shadow-lg border border-gray-200 sm:right-0">
                        <div className="flex space-x-2 text-amber-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Password is common
                        </div>
                        <div className="text-amber-700 max-w-xs">Lorem ipsum dolor sit amet.</div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default ToastMessage;