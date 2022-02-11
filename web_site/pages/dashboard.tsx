import React, { useState } from 'react';
import { NextPage } from 'next';
import {
    DataGrid, GridRenderCellParams, GridToolbarContainer,
} from '@mui/x-data-grid';
import Loading from './utils/loading'
import useSWR from 'swr';
import { GradientButton } from '../components/gradient-button';
import { useSubTitleContext } from '../context/sub-title-context';
import { RefreshIcon } from '@heroicons/react/solid'
import { useRequestsCount } from '../helpers/requests-count-helper';
import { useStartUrlsCount } from '../helpers/starts-url-helper';
import Pagination, { PaginationProps } from '@mui/material/Pagination';

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
                    <RefreshIcon className="py-1 h-8 w-8 text-blue-500 cursor-pointer" onClick={() => {
                        commicRequestsSWR.mutate();
                        commicStartUrlsCountSWR.mutate();
                    }} />
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
                    <RefreshIcon className="py-1 h-8 w-8 text-blue-500 cursor-pointer" onClick={() => {
                        chapterRequestsSWR.mutate();
                        chapterStartUrlsCountSWR.mutate();
                    }} />
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
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const { data, error, mutate } = useSWR(`/api/logs/items?page=${page}&row=10`, fetcher)
    const headerColumnClassName = 'bg-indigo-200 font-bold'
    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    console.log(data)
    return (
        <div className="p-10">
            <QueueRecord />
            {
                // <div style={{ height: 400, width: '100%' }}>
                //     <div style={{ display: 'flex', height: '100%' }} >
                //         <DataGrid style={{ flexGrow: 1 }}
                //             rows={data['data']}
                //             disableColumnFilter
                //             disableColumnSelector
                //             disableColumnMenu
                //             components={{
                //                 Toolbar: () => (
                //                     <GridToolbarContainer>
                //                         <div className='flex flex-row flex-grow bg-gradient-to-r 
                //                         from-blue-100 via-yellow-100 to-green-100'>
                //                             <div className='flex-1 '>
                //                                 <h3 className='self-center	 text-2xl text-red-500 font-bold'>
                //                                     下載記錄
                //                                 </h3>
                //                             </div>
                //                             <button className="h-10 px-5 m-2 
                //                             rounded-full  w-24 flex items-center justify-center
                //                             text-blue-100 transition-colors duration-150 
                //                             bg-blue-600  focus:shadow-outline hover:bg-blue-700"
                //                                 onClick={async () => {
                //                                     await setLoading(true)
                //                                     await setPage(1)
                //                                     await mutate()
                //                                     await setLoading(false)
                //                                 }}
                //                             >
                //                                 <RefreshIcon className="py-1 h-8 w-8 text-white-500 cursor-pointer" />
                //                             </button>
                //                         </div>
                //                     </GridToolbarContainer>
                //                 )!,
                //             }}
                //             columns={[
                //                 {
                //                     field: 'chapterUrl',
                //                     width: 150,
                //                     headerName: '下載來源',
                //                     sortable: false,
                //                     renderCell: (params: GridRenderCellParams) => (
                //                         <strong>
                //                             <GradientButton
                //                                 color='blue'
                //                                 variant="contained"
                //                                 style={{ marginLeft: 8 }}
                //                                 onClick={() => {
                //                                     window.open(params.value?.toString()!)
                //                                 }}
                //                             >
                //                                 前往網址
                //                             </GradientButton>
                //                         </strong>
                //                     ),
                //                     headerClassName: headerColumnClassName,

                //                 },
                //                 {
                //                     field: 'finishedTime',
                //                     minWidth: 200,
                //                     sortable: false,
                //                     headerName: '完成時間',
                //                     headerClassName: headerColumnClassName,

                //                 },

                //                 {
                //                     field: 'title',
                //                     headerName: "標題",
                //                     width: 500,
                //                     sortable: false,
                //                     headerClassName: headerColumnClassName,

                //                 },
                //                 {
                //                     field: 'error_msg',
                //                     headerName: '錯誤訊息',
                //                     width: 800,
                //                     sortable: false,
                //                     headerClassName: headerColumnClassName,
                //                 }


                //             ]}
                //             pagination
                //             page={page - 1}
                //             pageSize={10}
                //             rowsPerPageOptions={[5]}
                //             rowCount={data['count']}
                //             paginationMode="server"
                //             onPageChange={async (newPage) => {
                //                 await setLoading(true)
                //                 await setPage(newPage + 1)
                //                 await mutate()
                //                 await setLoading(false)

                //             }}
                //             loading={loading}
                //         />
                //     </div>
                // </div>
            }
            {

                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow-md sm:rounded-lg">
                                <table className="min-w-full">
                                    <thead className="bg-gray-200 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                下載來源
                                            </th>
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
                                                
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            Apple MacBook Pro 17
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                            Sliver
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                            Laptop
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                            $2999
                                                        </td>
                                                        <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                                            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                                        </td>
                                                    </tr>
                                                
                                            }

                                            )
                                        }
                                        {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                Apple MacBook Pro 17
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                Sliver
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                Laptop
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                                $2999
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                                <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {

                data && <Pagination count={data['count']} page={page} onChange={async (event: React.ChangeEvent<unknown>, currentPage: number) => {
                    console.log(event)
                    console.log(currentPage)
                    await setPage(currentPage) //currentPage+1
                    await mutate()
                }} />
            }

        </div>
    );
}

export default DashBoard;
