import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { getCsrfToken } from "next-auth/react";
import { useStartUrlsCount } from "../helpers/starts-url-helper";

const DownloadCount: NextPage = () => {
    const startUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls")
    console.log(startUrlsCountSWR.data)
    return <div>
         {/* !startUrlsCountSWR.isLoading && <span className="bg-red-100 text-red-800 text-sm font-medium 
                                                mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{startUrlsCountSWR.data['count']}</span> */}
    </div>
}

export default DownloadCount;