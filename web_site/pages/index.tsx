import React from 'react'
import { useSubTitleContext } from '../context/sub-title-context'
import { useRouter } from 'next/router'
import Loading from './utils/loading'
import useSWR from 'swr'
import { NextPage } from 'next'

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const Index: NextPage = () => {
  const { data, error } = useSWR('/api/category', fetcher)
  const router = useRouter()
  const subTitleContext = useSubTitleContext()
  subTitleContext.updateSubTitle('漫畫類別')
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
export default Index


{/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      {data.map((d: any) => (
        <Grid item xs={2} sm={4} md={4} key={d.title} className="rounded-full py-3 px-6 ">
          <div className="p-10 bg-blue-100">
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-500 hover:border-red-500">
              <h2 className="text-2xl font-bold  text-gray-800 text-center cursor-pointer	" onClick={() => {
                router.push({ pathname: '/commic', query: { url: d.link, subTitle: d.title } })
              }}>
                {d.title}
              </h2>
            </div>
          </div>
        </Grid>
      ))}
    </Grid> */}
