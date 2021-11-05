import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import useSWRInfinite from 'swr/infinite'
import { useSubTitleContext } from "../context/sub-title-context";
import Stack from "@mui/material/Stack";
import LinearProgress from '@mui/material/LinearProgress';
import Loading from "./utils/loading";
import Image from 'next/image'


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Commic: NextPage = () => {
    const router = useRouter()
    const subTitleContext = useSubTitleContext()
    const [showLoading, setShowLoading] = useState(false)
    subTitleContext.updateSubTitle(router.query['subTitle']?.toString()!)
    const { data, size, setSize, error } = useSWRInfinite(index =>
        `/api/commic?url=${router.query['url']}&page=${index + 1}`,
        fetcher)
    useEffect(() => {
        window.onscroll = async () => {
            if (showLoading) return
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                await setShowLoading(true)
                await setSize(size + 1)
                await setShowLoading(false)
            }
        };
    });
    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    return (
        <div className="flex flex-col">
            <div className="fixed  top-20 animated z-50 w-full">
                <button
                    className="  py-2 px-4 mt-5 bg-red-300 rounded-lg text-white font-semibold hover:bg-red-600"
                    onClick={() => {
                        router.push({
                            pathname: '/',
                        })
                    }}
                >
                    回上一頁
                </button>
            </div>
            <div className='grid  grid-rows-1 pt-20'>
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4">
                    {data && data.map((item: any) => (
                        item.map((itemData: any) => {
                            return (
                                <div className="rounded-lg shadow-xl bg-white py-3 px-6  border-2 border-purple-500 
                            hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-red-500 hover:ring-indigo-300" key={itemData.image}>
                                    <Image
                                        layout='responsive'
                                        width='100%'
                                        height='100%'
                                        src={itemData.image}
                                        alt={itemData.title}
                                        className="rounded-t-lg h-120 w-full object-cover z-0 "
                                        placeholder="blur"
                                        blurDataURL="./blur.jpg"
                                    />
                                    <header className=" text-xl font-extrabold p-4">{itemData.title}</header>

                                    <footer className="text-center py-3 px-8 text-gray-500">
                                        <button
                                            className="  py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
                                            onClick={() => {
                                                router.push({
                                                    pathname: '/chapter',
                                                    query: { url: itemData.link, subTitle: itemData.title, backUrl: '/commic?url=' + router.query['url'] + '&subTitle=' + router.query['subTitle']?.toString()! }
                                                })
                                            }}
                                        >
                                            看更多
                                        </button>
                                    </footer>
                                </div>
                            )


                        })
                    ))}
                </div>
                {showLoading && <Stack sx={{ width: '100%', color: 'grey.500', paddingTop: 10 }}>
                    <h2>載入中......</h2>
                    <LinearProgress color="secondary" />
                </Stack>}
            </div>
        </div>
    );
}

export default Commic;