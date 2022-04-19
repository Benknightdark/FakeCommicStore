import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
import { useStartUrlsCount } from "../helpers/starts-url-helper";

const DownloadCount: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [token,setToken]=useState("")
    useEffect(()=>{
        (async()=>{
            console.log(csrfToken)         
        })()
    })
    const startUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls", csrfToken)
    console.log(startUrlsCountSWR.data)
    return <div>
         {/* !startUrlsCountSWR.isLoading && <span className="bg-red-100 text-red-800 text-sm font-medium 
                                                mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{startUrlsCountSWR.data['count']}</span> */}
    </div>
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = await getCsrfToken(ctx)
    return {
        props: {
            csrfToken: token
        }
    }
}
export default DownloadCount;