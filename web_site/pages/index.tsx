import React from 'react'
import { useSubTitleContext } from '../context/sub-title-context'
import { useRouter } from 'next/router'
import Loading from '../components/loading'
import useSWR from 'swr'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { getCsrfToken } from 'next-auth/react'
import { globalSettingStore, initialGlobalSettingStore } from '../stores/global-setting-store'


const fetcher = (url: string,csrfToken:string) => fetch(url,{headers:{'x-csrf-token':csrfToken}}).then((res) => res.json());
const Index: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data:globalStoreData,mutate:mutateGlobalStoreData } = useSWR(globalSettingStore, { fallbackData: initialGlobalSettingStore })

  const { data, error } = useSWR([`/api/category?id=${globalStoreData.selectedSource.id}`, csrfToken], fetcher)
  const router = useRouter()
  mutateGlobalStoreData({ ...globalStoreData, subTitle: '漫畫類別' }, false)
  if (error) return <Loading></Loading>
  if (!data) return <Loading></Loading>

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {data.map((d: any) => (
        <div key={d.title} className="rounded-full py-3 px-6 ">
          <div className="p-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-200">
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
      props: {
          csrfToken: await getCsrfToken(ctx)
      }
  }
}
export default Index
