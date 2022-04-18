import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

/**
 * 取得待下載的連結數量
 *commic_url:requests
 chapter_url:requests
 * @return {*} 
 */
export const useRequestsCount = (keyName: string) => {
    const fetcher=(url:string,keyName:string)=>fetch(url, { method: 'POST',
     body: JSON.stringify({ keyName: keyName }),
     headers: { "X-Custom-Header": "AnotherValue"} 
    }).then((res) => res.json())
    const { data, error, mutate } = useSWR(
        [`/api/logs/requests?requestId=${keyName}`,keyName],
    fetcher,
        { refreshInterval: 10000 })
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}
