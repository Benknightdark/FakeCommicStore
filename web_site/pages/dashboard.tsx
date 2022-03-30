import React, { useState } from 'react';
import { NextPage } from 'next';

import Loading from './utils/loading'
import useSWR from 'swr';
import { useSubTitleContext } from '../context/sub-title-context';
import { useRequestsCount } from '../helpers/requests-count-helper';
import { useStartUrlsCount } from '../helpers/starts-url-helper';
import Pagination from '@mui/material/Pagination';
import { IoIosRefreshCircle } from 'react-icons/io'
import Tooltip from '@mui/material/Tooltip';
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const RecordItem = (props: any) => {
    return <div className="m-1 border-solid border-4 border-blue-900	
    bg-white rounded-xl shadow-md overflow-hidden item-center">
        <div className="flex-row lg:flex 
            xl:flex 
            2xl:flex justify-center content-center" >
            <div className={"flex items-center " + props?.itemBackgroundColor}>
                <div className="uppercase tracking-wide   
                lg:text-sm 
                xl:text-sm 
                2xl:text-sm text-lg
                text-indigo-900 font-semibold px-5 flex-grow">{props?.itemName}</div>
            </div>
            <div className="flex p-8 items-center content-center">
                <p className="tracking-wide  font-semibold  text-black lg:text-sm 
                xl:text-sm 
                2xl:text-sm text-lg flex-grow ">{props?.itemValue}</p>
            </div>
        </div>
    </div>
}

const QueueRecord = () => {
    const chapterRequestsSWR = useRequestsCount("chapter_url:requests")
    const chapterStartUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls")
    const commicRequestsSWR = useRequestsCount("commic_url:requests")
    const commicStartUrlsCountSWR = useStartUrlsCount("commic_url:start_urls")
    return <div className=" flex flex-col justify-center
    2xl:space-x-4 
    xl:space-x-4
    lg:space-x-4 
    lg:flex-row 
    xl:flex-row 
    2xl:flex-row">
        <div className='p-4'>
            <div className="shadow-md rounded-md overflow-hidden text-center border-solid border-4 border-blue-400">
                <div className="flex bg-gray-100">
                    <div className="py-3 px-5 flex-grow">漫畫佇列資訊</div>
                    <Tooltip title="重新取得漫畫佇列資訊" placement="top">
                        <div>
                            <IoIosRefreshCircle className="py-1 h-8 w-8 text-blue-500 cursor-pointer hover:h-10 hover:w-10" onClick={() => {
                                commicRequestsSWR.mutate();
                                commicStartUrlsCountSWR.mutate();
                            }} />
                        </div>
                    </Tooltip>
                </div>
                <div className="flex-1 2xl:flex xl:flex lg:flex flex-wrap mx-8 p-5">
                    <RecordItem key="commicRequestsSWR" itemBackgroundColor='bg-red-200' itemName='等待下載數量' itemValue={!commicRequestsSWR.isLoading && commicRequestsSWR.data['count']} />
                    <RecordItem key="commicStartUrlsCountSWR" itemBackgroundColor='bg-yellow-200' itemName='正在下載數量' itemValue={!commicStartUrlsCountSWR.isLoading && commicStartUrlsCountSWR.data['count']} />
                </div>
            </div>
        </div>
        <div className='p-4'>
            <div className="shadow-md rounded-md overflow-hidden text-center border-solid border-4 border-blue-400">
                <div className="flex bg-gray-100">
                    <div className="py-3 px-5 flex-grow">章節佇列資訊</div>
                    <Tooltip title="重新取得章節佇列資訊" placement="top">
                        <div>
                            <IoIosRefreshCircle className="py-1 h-8 w-8 text-blue-500 cursor-pointer hover:h-10 hover:w-10" onClick={() => {
                                chapterRequestsSWR.mutate();
                                chapterStartUrlsCountSWR.mutate();
                            }} />
                        </div>
                    </Tooltip>
                </div>
                <div className="flex-1 2xl:flex xl:flex lg:flex  flex-wrap mx-8 p-5">
                    <RecordItem key="chapterRequestsSWR" itemBackgroundColor='bg-red-200' itemName='等待下載數量' itemValue={!chapterRequestsSWR.isLoading && chapterRequestsSWR.data['count']} />
                    <RecordItem key="chapterStartUrlsCountSWR" itemBackgroundColor='bg-yellow-200' itemName='正在下載數量' itemValue={!chapterStartUrlsCountSWR.isLoading && chapterStartUrlsCountSWR.data['count']} />
                </div>
            </div>
        </div>
    </div>
}

const DashBoard: NextPage = () => {
    useSubTitleContext().updateSubTitle('DashBoard')
    const [page, setPage] = useState(1);
    const { data, error, mutate } = useSWR(`/api/logs/items?page=${page}&row=5`, fetcher)
    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    data['data'].map((d: any) => {
        console.log(d)
    })
    return (
        <div className="p-10">
            <QueueRecord />
            {
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow-md sm:rounded-lg">
                                <div className="flex p-4 text-sm text-gray-700 bg-green-100 rounded-lg dark:bg-green-700 
                                dark:text-gray-300 justify-between" role="alert">
                                    <span className="text-2xl">下載記錄</span>
                                    <Tooltip title="重新取得下載資料" placement="top">
                                        <div>
                                            <IoIosRefreshCircle className="inline flex-shrink-0 mr-3 w-8 h-8 cursor-pointer hover:h-10 hover:w-10" onClick={() => {
                                                setPage(1);
                                                mutate();
                                            }}>
                                            </IoIosRefreshCircle>
                                        </div>
                                    </Tooltip>
                                </div>
                                <table className="min-w-full">
                                    <thead className="bg-gray-200 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                完成時間
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                標題
                                            </th>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                錯誤訊息
                                            </th>
                                            <th scope="col" className="relative py-3 px-6">
                                                <span className="sr-only">前往網址</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data && data['data'].map((d: any) => {
                                                return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={d['chapterUrl']}>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                                    >
                                                        {d['finishedTime']}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                        {d['title']}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                        {d['error_msg']}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                                        <a href={d['chapterUrl']}
                                                            className="monochrome-cyan-btn">
                                                            前往網址
                                                        </a>
                                                    </td>
                                                </tr>
                                            }
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {
                        data && <div className='flex justify-center'>
                            <Pagination count={data['count']} page={page}
                                onChange={async (event: React.ChangeEvent<unknown>, currentPage: number) => {
                                    await setPage(currentPage)
                                    await mutate()
                                }} />
                        </div>
                    }
                </div>
            }

        </div>
    );
}

export default DashBoard;
