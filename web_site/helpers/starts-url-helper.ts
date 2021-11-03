import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

/**
 * 取得正要下載的網頁數量
 * commic_url:start_urls
 * chapter_url:start_urls
 * @return {*} 
 */
export const useStartUrlsCount = (keyName:string) => {
    const { data, error, mutate } = useSWR(`/api/logs/start-urls?requestId=${keyName}`,
        (url: string) => fetch(url, { method: 'POST', body: JSON.stringify({ keyName: keyName }) }).then((res) => res.json()),
        { refreshInterval: 10000 })
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}

