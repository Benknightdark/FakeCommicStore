import React, { Fragment, useState } from "react";
import { GiSpellBook, GiHamburgerMenu } from 'react-icons/gi'
import { AiFillEye, AiFillEyeInvisible, AiOutlineBarChart } from "react-icons/ai";
import { ImBooks } from 'react-icons/im';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DownloadCount from "../../components/download-count";
import useSWR from "swr";
import { initialGlobalSettingStore, globalSettingStore } from "../../stores/global-setting-store";
import Image from 'next/image'

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    const router = useRouter()
    const session = useSession();
    const [openMenu, setOpenMenu] = useState<string>("-translate-x-full")
    const searchCommic = async (value: any) => {
        const subTitle = value.currentTarget.value
        if (subTitle.replace(/\s/g, "") == "") {
            router.push({ pathname: '/' })
            return
        }
        setTimeout(() => {
            let link = ''
            switch (globalStoreData.selectedSource.id) {
                case 1:
                    link = `https://www.comicun.com/search-index?q=${subTitle}`
                    break;
                case 2:
                    link = `https://18comic.org/search/photos?search_query=${subTitle}&main_tag=0`
                    break;
                case 3:
                    link = `https://www.jjmhw.cc/search?keyword=${subTitle}`
                    break;
            }

            router.push({ pathname: '/commic', query: { url: link, subTitle: subTitle } })
        }, 500);
    }
    return (

        <Fragment>
            <div className="flex flex-col h-screen">
                {/* 標題列 */}
                <header className="bg-gradient-to-r from-blue-100 to-green-200  w-full">
                    <div className="p-3">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-2 rounded-lg  bg-yellow-300">
                                    <GiSpellBook className="h-6 w-6 text-white cursor-pointer" aria-hidden="true"
                                        onClick={
                                            () => {
                                                router.push('/')
                                            }
                                        }
                                    ></GiSpellBook>
                                </span>
                                <p className="ml-3 mr-3 font-medium text-white truncate  hidden
                                sm:inline-flex 
                                ">
                                    <span className='dark:text-white text-black hover:font-bold'>🔥Fake Commic Store  {globalStoreData.subTitle !== '' ? ' / ' + globalStoreData.subTitle : ''}</span>
                                </p>
                                {!globalStoreData?.showImage ?<div className="tooltip tooltip-bottom" data-tip="顯示圖片"> 
                                <AiFillEye className='cursor-pointer w-7 h-7' onClick={() => {
                                    mutateGlobalStoreData({ ...globalStoreData, showImage: true }, false)
                                }}
                                ></AiFillEye></div> : <div className="tooltip tooltip-bottom" data-tip="隱藏圖片"> <AiFillEyeInvisible className='cursor-pointer w-7 h-7' onClick={() => {
                                    mutateGlobalStoreData({ ...globalStoreData, showImage: false }, false)
                                }}
                                ></AiFillEyeInvisible></div>}

                                <div className="dropdown">
                                    <label tabIndex={0} className=" m-1 hidden xl:btn">切換來源 ({globalStoreData?.selectedSource?.name})</label>
                                    <div className="tooltip tooltip-bottom" data-tip="切換來源">
                                        <ImBooks tabIndex={0} className="w-7 h-7 m-1  flex xl:hidden
                                     text-red-900 cursor-pointer"></ImBooks>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        {
                                            globalStoreData && globalStoreData.sourceList.map((s: any) =>
                                                <li key={s.id} className={`${globalStoreData.selectedSource.id === s.id ? "text-red-500" : ""}`}
                                                    onClick={() => {
                                                        mutateGlobalStoreData({ ...globalStoreData, selectedSource: s }, false)
                                                    }}
                                                >
                                                    <a> {s.name}</a>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>

                            </div>
                            <div className="justify-end flex-row">
                                <div className="p-2 
                                      hidden  md:inline-block xl:inline-block lg:inline-block 2xl:inline-block">
                                    <label htmlFor="table-search" className="sr-only">Search</label>
                                    <div className="relative mt-1">
                                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                    clipRule="evenodd"></path></svg>
                                        </div>
                                        <input type="text" id="table-search" className="bg-gray-50 border
                                             border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                              focus:border-blue-500 block  pl-10 p-2.5  dark:bg-gray-700
                                               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                               dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋漫畫"
                                            onBlur={async (value) => {

                                                await searchCommic(value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <button type='button' className='green-btn
                                     hidden  md:inline-block xl:inline-block lg:inline-block 2xl:inline-block'
                                    onClick={
                                        () => {
                                            router.push('/dashboard')
                                        }
                                    }
                                >
                                    <div className="flex space-x-2">
                                        <AiOutlineBarChart className='text-gray-100 dark:text-gray-800 h-5 w-5'></AiOutlineBarChart>
                                        下載進度查詢
                                        <DownloadCount />
                                    </div>
                                </button>
                                {session.status == 'unauthenticated' && (
                                    <button className='grow  blue-btn' onClick={() => { router.push("/account/login") }}>登入</button>
                                )

                                }

                                {session.status == 'authenticated' &&

                                    <div className="tooltip tooltip-bottom" data-tip="你是否要登出？">
                                        <label htmlFor="logout-modal" className='blue-btn  modal-button'
                                        >
                                            {session?.data?.user?.name}</label>
                                    </div>

                                }
                                {session.status == 'authenticated' &&
                                    <button className='grow red-btn' onClick={() => { router.push("/favorite") }}>我的最愛</button>
                                }
                                <span className="p-3 rounded-lg dark:bg-indigo-800 bg-blue-300 
                                    2xl:hidden              
                                    xl:hidden 
                                    md:hidden
                                    nmd:hidden
                                    sm: inline-flex
                                    ">
                                    <GiHamburgerMenu className="h-6 w-6 text-white cursor-pointer"
                                        onClick={
                                            () => {
                                                if (openMenu !== '') {
                                                    setOpenMenu("")
                                                } else {
                                                    setOpenMenu("-translate-x-full")
                                                }
                                            }
                                        }
                                    ></GiHamburgerMenu>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                {/* 行動裝置版面的標題列 */}
                <div
                    className={
                        `sidebar bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2
                        inset-y-0 left-0 transform  
                        z-50
                        absolute     
                        2xl:hidden              
                        xl:hidden 
                        md:hidden
                        nmd:hidden
                        sm:relative
                        sm:translate-x-0                     
                        transition duration-200 ease-in-out 
                        ${openMenu}`
                    }>
                    <a href="#" className="text-white flex items-center space-x-2 px-4">
                        <span className="text-2xl font-extrabold">🔥Fake Commic Store {globalStoreData.subTitle !== '' ? ' / ' + globalStoreData.subTitle : ''}</span>
                    </a>
                    <nav>
                        <div className='block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white cursor-pointer'
                            onClick={
                                () => {
                                    setOpenMenu("-translate-x-full")
                                    router.push('/dashboard')
                                }
                            }
                        >
                            <div className="flex space-x-2">
                                <AiOutlineBarChart className='text-gray-100 dark:text-gray-800 h-5 w-5'></AiOutlineBarChart>
                                下載進度查詢
                                <DownloadCount />

                            </div>
                        </div>

                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
                            <input type="text" id="table-search" className="bg-gray-50 border 
                                             border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                              focus:border-blue-500 block  pl-10 p-2.5  dark:bg-gray-700
                                               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                               dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋漫畫"
                                onBlur={async (value) => {
                                    await searchCommic(value)
                                }}
                            />
                        </div>
                    </nav>
                </div>
                {/* 內容主頁 */}
                <div className=" bg-slate-50 dark:bg-black flex-1 overflow-y-auto overflow-x-hidden" id="contentBody">
                    {children}
                </div>
                {/* 頁腳 */}
                <footer className="py-5 bg-gray-700 text-center text-white">
                    made by ben 😎 ({`${process.env.NEXT_PUBLIC_ENV}`})
                </footer>
                {/* 登出Modal視窗 */}
                <div>
                    <input type="checkbox" id="logout-modal" className="modal-toggle" />
                    <label htmlFor="logout-modal" className="modal cursor-pointer">
                        <label className="modal-box relative" htmlFor="">
                            <h3 className="text-2xl font-bold">你確定要登出嗎？</h3>
                            <Image src='https://media3.giphy.com/media/UrzZ4TmQK17yJpYPIL/giphy.gif?cid=ecf05e47gj882bfm331v6bl56st37vs0ma3a9yy6ywswxz9t&rid=giphy.gif&ct=s'
                                alt='' layout='responsive' width='20px' height='20px'></Image>
                            <div className="modal-action">
                                <label htmlFor="logout-modal" className="btn btn-success" onClick={() => { signOut() }}>確定</label>
                                <label htmlFor="logout-modal" className="btn btn-warning">取消</label>
                            </div>
                        </label>

                    </label>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;

