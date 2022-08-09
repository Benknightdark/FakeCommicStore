import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import useSWR from 'swr'
import React, { ReactElement, useState } from 'react'
import Loading from '../components/loading'
import { useRouter } from 'next/router'
import { AiTwotoneDelete, AiOutlineCloudDownload, AiOutlineDownload } from 'react-icons/ai'
import { getCsrfToken } from 'next-auth/react'
import { globalSettingStore, initialGlobalSettingStore } from '../stores/global-setting-store'
import FloatBtnLayout from './utils/float-btn-layout'
const fetcher = (url: string, csrfToken: string) => fetch(url, { headers: { 'x-csrf-token': csrfToken } }).then((res) => res.json());

const Chapter = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    mutateGlobalStoreData({ ...globalStoreData, subTitle: router.query['subTitle']?.toString()! }, false)

    const { data, error, mutate } = useSWR([`/api/chapter?url=${router.query['url']}&id=${globalStoreData.selectedSource.id}`, csrfToken], fetcher, {
        revalidateOnFocus: false
    })

    const [selectData, updateSelectData] = useState<string[]>([])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const link = event.target.ariaLabel
        const checked = event.target.checked
        const title = event.target.ariaCurrent
        const newData = data.map((d: any) => {
            if (d.title == title) {
                d.checked = checked
            }
            return d
        })
        mutate([])
        mutate([...newData])
        const newLink = `${link}?subFolderName=${title}&rootFolderName=${router.query['subTitle']?.toString()!}&id=${globalStoreData.selectedSource.id}`
        if (checked) {
            selectData.push(newLink)
            updateSelectData(selectData)
            console.log(selectData)
        } else {
            updateSelectData(selectData.filter(a => a !== newLink))
            console.log(selectData)
        }

    };

    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    return <div>
        {/* 浮動按鈕 */}
        <div style={{
            position: 'fixed',
            bottom: 40,
            right: 20,
            zIndex: 2231000,
        }}>
            <button type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 
            hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 shadow-lg
             shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium
             rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                }}>
                <div className="flex space-x-2">
                    <AiTwotoneDelete className="mr-2 -ml-1 w-5 h-5"></AiTwotoneDelete>
                    清除全部
                </div>
            </button>

            <button type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 
            hover:bg-gradient-to-br focus:ring-4 focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 
            dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const allData = data.map((r: any) => `${r.link}?subFolderName=${r.title}&rootFolderName=${router.query['subTitle']?.toString()!}&id=${globalStoreData.selectedSource.id}`)
                    console.log(allData)
                    const req = await fetch(`/api/download`, {
                        body: JSON.stringify(allData),
                        headers: {
                            'content-type': 'application/json',
                            'x-csrf-token': csrfToken
                        },
                        method: 'POST',
                    })
                    const res = await req.text()
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                    console.log(res)
                    document.getElementById('show-modal-btn')?.click();
                }}
            >
                <div className="flex space-x-2">
                    <AiOutlineCloudDownload className="mr-2 -ml-1 w-5 h-5"></AiOutlineCloudDownload>
                    下載全部
                </div>
            </button>

            <button type="button"
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br 
 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg
  dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const req = await fetch(`/api/download`, {
                        body: JSON.stringify(selectData), // must match 'Content-Type' header
                        headers: {
                            'content-type': 'application/json',
                            'x-csrf-token': csrfToken
                        },
                        method: 'POST',
                    })
                    if (req.status === 200) {
                        const res = await req.text()
                        const newData = data.map((d: any) => {
                            d.checked = false
                            return d
                        })
                        mutate([])
                        mutate([...newData])
                        console.log(res)
                        document.getElementById('show-modal-btn')?.click();

                    } else {
                        alert((await req.json())['message'])
                    }

                }}
            >
                <div className="flex space-x-2">
                    <AiOutlineDownload className="mr-2 -ml-1 w-5 h-5"></AiOutlineDownload>
                    下載
                </div>
            </button>


        </div>
        {/* Alert Window */}
        <div>
            <label htmlFor="show-modal" className="btn modal-button hidden" id='show-modal-btn'></label>
            <input type="checkbox" id="show-modal" className="modal-toggle" />
            <label htmlFor="show-modal" className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    <h3 className="text-2xl font-bold">開始下載</h3>
                    <p className="py-4">
                        {router.query['subTitle']}
                    </p>
                </label>
            </label>
        </div>
        {/* 漫畫章節列表 */}
        {/* <div className="flex flex-col"> */}
        <div className=" flex flex-wrap pt-20 p-5">
            <ul className="menu bg-base-100  rounded-box w-1/2 border-4 border-indigo-600">
                {data.map((d: any) => (
                    <li key={d.title}
                        className=" border-b-4 border-indigo-500">
                        <div className='justify-items-end	justify-arround	flex'>
                            <a>{d.title}</a>
                            <div/>
                            <input type="checkbox" checked={d.checked} className="checkbox"
                                aria-label={d.link} aria-current={d.title}
                                onChange={handleChange}
                            />
                        </div>
                    </li>

                ))}

            </ul>
            {/* {data.map((d: any) => (
                    <div key={d.title} className="rounded-full py-3 px-6 ">
                        <div className="p-5 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-200">
                            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-500 
                                            hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 
                                            hover:border-red-500 hover:ring-indigo-300 flex-1
                                            ">
                                <div className='justify-items-end	justify-end	flex'>
                                    <input type="checkbox" checked={d.checked} className="checkbox"
                                        aria-label={d.link} aria-current={d.title}
                                        onChange={handleChange}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold  text-gray-800 text-center cursor-pointer	"
                                    onClick={() => {
                                        window.open(d.link)?.focus();
                                    }}
                                >
                                    {d.title}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))} */}
        </div>
        {/* </div> */}
    </div>
}
Chapter.getLayout = function getLayout(page: ReactElement) {
    return (
        <div>
            <FloatBtnLayout>{page}</FloatBtnLayout>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {
            csrfToken: await getCsrfToken(ctx)
        }
    }
}
export default Chapter
