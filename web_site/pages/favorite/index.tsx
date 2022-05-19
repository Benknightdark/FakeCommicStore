import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWRInfinite from 'swr/infinite'
import Loading from "../../components/loading";
import Image from 'next/image'
import useSWR from "swr";
import { globalSettingStore, initialGlobalSettingStore } from "../../stores/global-setting-store";
import LoadingProgress from "../../components/loading-progress";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Index = () => {
    const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })

    const session = useSession();
    const router = useRouter()
    const [showLoading, setShowLoading] = useState(false)
    const { data, size, setSize, error } = useSWRInfinite(index =>
        `/api/favorite/get?page=${index}`,
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
    if (session.status == "unauthenticated") {
        return (
            <div>
                <Image src="https://i.giphy.com/media/lvQe7YwEEJoaIluvs6/giphy.webp" alt="not accessed" layout="fill"
                    className="cursor-pointer"
                    onClick={() => {
                        router.back()
                    }}
                ></Image>
            </div>
        );
    } else {
        if (error) return <Loading></Loading>
        if (!data) return <Loading></Loading>
        return (
            <div className="flex flex-col">

                <div className='grid  grid-rows-1 pt-20'>
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
                                                    className="  py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
                                                    onClick={() => {
                                                        router.push({
                                                            pathname: '/chapter',
                                                            query: { url: itemData.link, subTitle: itemData.title, backUrl: '/favorite' }
                                                        })
                                                    }}
                                                >
                                                    看更多
                                                </button>
                                                <button
                                                    className="  py-2 px-4 mt-5 bg-red-400 rounded-lg text-white font-semibold hover:bg-red-600"
                                                    onClick={async () => {
                                                        const req = await fetch("/api/favorite/remove", {
                                                            method: "POST",
                                                            body: JSON.stringify(itemData),
                                                            headers: { "content-type": "application/json" },
                                                        });
                                                        if (req.status === 200) {
                                                            alert(`已移除『${itemData.title}』`)

                                                        } else {
                                                            const message = (await req.json());
                                                            alert(message['message'])
                                                        }
                                                    }}
                                                >
                                                    移除最愛
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

}

export default Index;