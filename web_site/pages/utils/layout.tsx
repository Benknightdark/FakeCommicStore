import React, { Fragment, useState } from "react";
import { SubTitleContext } from "../../context/sub-title-context";
import { GiSpiderMask, GiHamburgerMenu } from 'react-icons/gi'
import { AiFillEye, AiFillEyeInvisible, AiOutlineBarChart } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import DownloadCount from "../../components/download-count";
import useSWR from "swr";
import { initialGlobalSettingStore, globalSettingStore } from "../../stores/global-setting-store";


const Layout = ({ children }: React.PropsWithChildren<{}>) => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })

    const router = useRouter()
    const [subTitle, setSubTitle] = useState<string>("");
    // const startUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls",csrfToken)
    const session = useSession();
    const [openMenu, setOpenMenu] = useState<string>("-translate-x-full")
    const updateSubTitle = (text: string) => {
        if (text !== '')
            setSubTitle(` / ${text}`)
        else
            setSubTitle(``)
    };
    return (
        <SubTitleContext.Provider value={{ updateSubTitle }}>
            <Fragment>
                <div className="flex flex-col h-screen">
                    <header className="bg-gradient-to-r from-yellow-400 to-orange-200  w-full">
                        <div className="p-3">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="w-0 flex-1 flex items-center">
                                    <span className="flex p-2 rounded-lg dark:bg-indigo-800 bg-yellow-600">
                                        <GiSpiderMask className="h-6 w-6 text-white cursor-pointer" aria-hidden="true"
                                            onClick={
                                                () => {
                                                    router.push('/')
                                                }
                                            }
                                        ></GiSpiderMask>
                                    </span>
                                    <p className="ml-3 mr-3 font-medium text-white truncate">
                                        <span className='dark:text-white text-black hover:font-bold'>🔥Fake Commic Store  {subTitle}</span>
                                    </p>
                                    {!globalStoreData?.showImage ? <AiFillEye className='cursor-pointer w-7 h-7' onClick={() => {
                                        mutateGlobalStoreData({ ...globalStoreData, showImage: true }, false)
                                    }}
                                    ></AiFillEye> : <AiFillEyeInvisible className='cursor-pointer w-7 h-7' onClick={() => {
                                        mutateGlobalStoreData({ ...globalStoreData, showImage: false }, false)
                                    }}
                                    ></AiFillEyeInvisible>}
                                    <button id="dropdownDefault" data-dropdown-toggle="dropdown" className="text-white bg-blue-700
                                     hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                                     text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 
                                     dark:focus:ring-blue-800" type="button">切換來源 </button>

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
                                                    const subTitle = value.currentTarget.value
                                                    if (subTitle.replace(/\s/g, "") == "") {
                                                        router.push({ pathname: '/' })
                                                        return
                                                    }
                                                    setTimeout(() => {
                                                        const link = `https://www.comicun.com/search-index?q=${subTitle}`
                                                        router.push({ pathname: '/commic', query: { url: link, subTitle: subTitle } })
                                                    }, 500);

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
                                            {/* 
                                            {
                                                !startUrlsCountSWR.isLoading && <span className="bg-red-100 text-red-800 text-sm font-medium 
                                                mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{startUrlsCountSWR.data['count']}</span>
                                            } */}
                                            <DownloadCount />
                                        </div>
                                    </button>
                                    {session.status == 'unauthenticated' && (
                                        <button className='grow  blue-btn' onClick={() => { router.push("/account/login") }}>登入</button>
                                    )

                                    }

                                    {session.status == 'authenticated' &&
                                        <Tooltip title="是否要登出?" placement="top-start">
                                            <button type='button' className='grow  blue-btn'
                                                onClick={() => { signOut() }}>
                                                {session?.data?.user?.name}</button>
                                        </Tooltip>
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
                    <div className=" bg-slate-50 dark:bg-black flex-1 overflow-y-auto overflow-x-hidden" id="contentBody">
                        {children}
                    </div>
                    <div
                        className={
                            `sidebar bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2
                        inset-y-0 left-0 transform  
                        z-100
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
                            <span className="text-2xl font-extrabold">🔥Fake Commic Store {subTitle}</span>
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
                                        const subTitle = value.currentTarget.value
                                        if (subTitle.replace(/\s/g, "") == "") {
                                            router.push({ pathname: '/' })
                                            return
                                        }
                                        setTimeout(() => {
                                            const link = `https://www.comicun.com/search-index?q=${subTitle}`
                                            router.push({ pathname: '/commic', query: { url: link, subTitle: subTitle } })
                                        }, 500);

                                    }}
                                />
                            </div>
                        </nav>
                    </div>
                    <footer className="py-5 bg-gray-700 text-center text-white">
                        made by ben 😎
                    </footer>
                </div>
            </Fragment>

        </SubTitleContext.Provider>
    );
}

export default Layout;

