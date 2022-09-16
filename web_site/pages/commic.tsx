import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import React, { ReactElement, useEffect, useState } from "react";
import useSWRInfinite from 'swr/infinite'
import Loading from "../components/loading";
import Image from 'next/image'
import { useRouter } from "next/router";
import { getCsrfToken } from "next-auth/react";
import useSWR from "swr";
import { globalSettingStore, initialGlobalSettingStore } from "../stores/global-setting-store";
import LoadingProgress from "../components/loading-progress";
import FloatBtnLayout from "./utils/float-btn-layout";
import { BsFillArrowUpRightCircleFill, BsHeartFill } from "react-icons/bs";
import { addToFavorite } from "../helpers/favorite-helper";


const fetcher = (url: string, csrfToken: string) => fetch(url, { headers: { 'x-csrf-token': csrfToken } }).then((res) => res.json());

const Commic = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })
    const router = useRouter()
    const [showLoading, setShowLoading] = useState(false)
    mutateGlobalStoreData({ ...globalStoreData, subTitle: router.query['subTitle']?.toString()! }, false)
    const { data, size, setSize, error } = useSWRInfinite(index =>
        [`/api/commic?url=${router.query['url']}&page=${index + 1}&id=${globalStoreData.selectedSource.id}`, csrfToken],
        fetcher)
    useEffect(() => {
        document.getElementById('contentBody')!.onscroll = async () => {
            if (showLoading) return
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                console.log("開始撈下一頁")
                await setShowLoading(true)
                await setSize(size + 1)
                await setShowLoading(false)
                console.log("完成撈下一頁")
                console.log('----------------------------')
            }
        };
    });
    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    return (
        <div className="flex flex-col">
            <div className='grid  grid-rows-1 pt-20' >
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4">
                    {data && data.map((item: any) => (
                        item.map((itemData: any) => {
                            return (
                                <div className="rounded-lg shadow-xl bg-white py-3 px-6  border-2 border-purple-500 
                            hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-red-500 hover:ring-indigo-300" key={itemData.image}>
                                    {globalStoreData?.showImage && <Image
                                        layout='responsive'
                                        width='100%'
                                        height='100%'
                                        src={itemData.image}
                                        alt={itemData.title}
                                        className="rounded-t-lg h-120 w-full object-cover z-0 "
                                        placeholder="blur"
                                        blurDataURL="./blur.jpg"
                                    />}
                                    <header className=" text-xl font-extrabold p-4">{itemData.title}</header>

                                    <footer className="text-center py-3 px-5 text-gray-500">
                                        <div className="flex flex-row space-x-4">
                                            <button
                                                className="  py-2 px-4 mt-5 bg-green-500 
                                                rounded-lg text-white font-semibold hover:bg-green-600 flex flex-row"
                                                onClick={() => {
                                                    // console.log(itemData)
                                                    router.push({
                                                        pathname: '/chapter',
                                                        query: { url: itemData.link, subTitle: itemData.title, 
                                                            data:JSON.stringify(itemData),
                                                            backUrl: '/commic?url=' + router.query['url'] + '&subTitle=' + router.query['subTitle']?.toString()! }
                                                    })
                                                }}
                                            ><BsFillArrowUpRightCircleFill className='w-5 h-5'></BsFillArrowUpRightCircleFill>
                                                看更多
                                            </button>
                                            <button
                                                className="  py-2 px-4 mt-5 bg-yellow-400 rounded-lg
                                                 text-white font-semibold hover:bg-yellow-600 flex flex-row"
                                                onClick={async () => {
                                                    await addToFavorite(itemData);
                                                }}
                                            >
                                                <BsHeartFill className='w-5 h-5 m-1'></BsHeartFill>
                                                加入最愛
                                            </button>
                                        </div>


                                    </footer>
                                </div>
                            )
                        })
                    ))}
                </div>
                {showLoading && <LoadingProgress></LoadingProgress>}
            </div>
        </div>
    );
}
Commic.getLayout = function getLayout(page: ReactElement) {
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

export default Commic;