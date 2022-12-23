import React from 'react'
import { useRouter } from 'next/router'
import Loading from '../components/loading'
import useSWR from 'swr'
import { globalSettingStore, initialGlobalSettingStore } from '../stores/global-setting-store'
import { useEffect } from 'react'
import { NextPage } from 'next'


const fetcher = (url: string) => fetch(url).then((res) => res.json());
const Index: NextPage = () => {
  const { data: globalStoreData, mutate: mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })

  const { data, error } = useSWR([`/api/category?id=${globalStoreData.selectedSource.id}`], fetcher)
  const router = useRouter()
  useEffect(() => {
    mutateGlobalStoreData({ ...globalStoreData, subTitle: '漫畫類別' }, false)
  }, [mutateGlobalStoreData, globalStoreData])
  if (error) return <Loading></Loading>
  if (!data) return <Loading></Loading>

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {data.map((d: any) => (
        <div key={d.title} className="py-3 px-6 ">
          <div className="p-10 card-background background-animate-hover rounded-lg ">
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-500 
            hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-red-500 hover:ring-indigo-300
            ">
              <h2 className="text-2xl font-bold  text-gray-800 text-center cursor-pointer	" onClick={() => {
                router.push({ pathname: '/commic', query: { url: d.link, subTitle: d.title } })
              }}>
                {d.title}
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>

  )
}

export default Index
