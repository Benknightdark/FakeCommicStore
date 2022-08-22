import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import useSWR from 'swr'
import React, { ReactElement, useState } from 'react'
import Loading from '../components/loading'
import { useRouter } from 'next/router'
import { AiTwotoneDelete, AiOutlineCloudDownload, AiOutlineDownload, AiFillCloseCircle, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { getCsrfToken } from 'next-auth/react'
import { globalSettingStore, initialGlobalSettingStore } from '../stores/global-setting-store'
import { FcStackOfPhotos } from 'react-icons/fc'
import { TbBrowser } from 'react-icons/tb'
import FloatBtnLayout from './utils/float-btn-layout'
import PhotoAlbum from 'react-photo-album'
import { HiSortAscending, HiSortDescending } from 'react-icons/hi'
import { BsArrowsFullscreen, BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsHeartFill } from 'react-icons/bs'
import { addToFavorite } from '../helpers/favorite-helper'
const fetcher = (url: string, csrfToken: string) => fetch(url, { headers: { 'x-csrf-token': csrfToken } }).then((res) => res.json());

const Chapter = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [desc, setDesc] = useState(1);
    const router = useRouter()
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    mutateGlobalStoreData({ ...globalStoreData, subTitle: router.query['subTitle']?.toString()! }, false)
    const [imageList, setImageList] = useState<any>({});
    const { data, error, mutate } = useSWR([`/api/chapter?url=${router.query['url']}&id=${globalStoreData.selectedSource.id}&desc=${desc}`, csrfToken], fetcher, {
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
    const handleShowImageList = async (d: any, i: number) => {
        try {
            const req = await fetch(`/api/view`, {
                body: JSON.stringify({
                    id: globalStoreData.selectedSource.id,
                    url: d.link
                }),
                headers: {
                    'content-type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                method: 'POST',
            })
            const res = await req.json();
            setImageList({ ...imageList, data: res, title: d.title, prev: i - 1, next: i + 1, current: i });
        } catch (error) {
            console.log(error)
        }

    }
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
                }}>
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

                }}>
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
        <label htmlFor="image-modal" className="btn modal-button hidden" id='image-modal-btn'></label>

        <input type="checkbox" id="image-modal" className="modal-toggle" />
        <label htmlFor="image-modal" className="modal cursor-pointer space-x-3">
            <button className="btn btn-circle btn-error" onClick={async () => {
                await handleShowImageList(data[imageList.prev], imageList.prev)
            }}>
                <AiOutlineArrowLeft className='text-white font-bold w-6 h-6'></AiOutlineArrowLeft>
            </button>
            {
                imageList.data && <div className='  h-screen overflow-auto'>
                    <PhotoAlbum layout="columns" photos={imageList.data} columns={1} spacing={0} />
                </div>
            }
            <button className="btn btn-circle btn-error" onClick={async () => {
                await handleShowImageList(data[imageList.next], imageList.next)
            }}>
                <AiOutlineArrowRight className='text-white font-bold w-6 h-6'></AiOutlineArrowRight>
            </button>
        </label>
        {/* 漫畫章節列表 */}
        <div className=" flex flex-row  flex-wrap pt-20 p-3 justify-center space-x-2">
            <div className="card  bg-base-100 shadow-xl  md:w-1/2 w-full h-96 mt-2 ">
                <div className="card-body h-80">
                    <h2 className="card-title">章節列表
                        {desc == 1 ? <HiSortAscending className='cursor-pointer' onClick={() => {
                            setDesc(0)
                            mutate();
                        }}></HiSortAscending> : <HiSortDescending className='cursor-pointer' onClick={() => {
                            setDesc(1)
                            mutate();
                        }}></HiSortDescending>}
                        <button
                            className="  m-5  bg-yellow-400 rounded-lg
                                                 text-white  font-semibold hover:bg-yellow-600 flex flex-row"
                            onClick={async () => {
                               
                                await addToFavorite(JSON.parse( router.query['data']));
                            }}
                        >
                            <BsHeartFill className='w-4 h-4 m-1'></BsHeartFill>
                            加入最愛
                        </button>
                    </h2>
                    {data && <ul className=" overflow-auto menu bg-base-100  rounded-box 
                      border-4 border-indigo-600">
                        {data.map((d: any, i: any) => (
                            <li key={i}
                                className={`border-b-4 border-indigo-500 ${imageList?.title == d.title ? 'bg-gradient-to-l from-yellow-200 via-green-200 to-green-300' : ''}`}>
                                <div className='flex justify-arround '>
                                    <a className='p-l-10'>{d.title}</a>
                                    <div className='flex space-x-2'>
                                        <input type="checkbox" checked={d.checked} className="checkbox "
                                            aria-label={d.link} aria-current={d.title}
                                            onChange={handleChange}
                                        />
                                        <div className="tooltip  tooltip-bottom z-50" data-tip="看圖片">
                                            <FcStackOfPhotos className='w-8 h-8' onClick={async () => {
                                                await handleShowImageList(d, i)
                                            }}></FcStackOfPhotos>
                                        </div>
                                        <div className="tooltip  tooltip-bottom z-50" data-tip="開啟外部網站">
                                            <TbBrowser className='w-8 h-8' onClick={async () => {
                                                window.open(d.link)?.focus();
                                            }}></TbBrowser>
                                        </div>

                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
            {
                imageList.data && <div className=' flex flex-col justify-center border-4 hover:border-emerald-500	border-emerald-500/50 p-3'>
                    <div className='flex flex-row justify-center font-bold text-lg space-x-3'>
                        <BsFillArrowLeftSquareFill
                            className='cursor-pointer h-5 w-5 text-blue-400 hover:text-red-400'
                            onClick={async () => {
                                await handleShowImageList(data[imageList.prev], imageList.prev)
                            }}
                        ></BsFillArrowLeftSquareFill>
                        <h2>
                            {imageList.title}
                        </h2>
                        <BsArrowsFullscreen
                            className='cursor-pointer h-5 w-5 text-blue-400 hover:text-red-400'
                            onClick={() => {
                                document.getElementById('image-modal-btn')?.click();
                            }}
                        >
                        </BsArrowsFullscreen>

                        <AiFillCloseCircle className='cursor-pointer h-5 w-5 text-blue-400 hover:text-red-400'
                            onClick={() => {
                                setImageList({})
                            }}
                        >
                        </AiFillCloseCircle>
                        <BsFillArrowRightSquareFill
                            className='cursor-pointer h-5 w-5 text-blue-400 hover:text-red-400'
                            onClick={async () => {
                                await handleShowImageList(data[imageList.next], imageList.next)
                            }}
                        ></BsFillArrowRightSquareFill>
                    </div>

                    <div className='  h-[32rem] overflow-auto'>
                        <PhotoAlbum layout="columns" photos={imageList.data} columns={1} spacing={0} />
                    </div>
                </div>
            }
        </div>

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
