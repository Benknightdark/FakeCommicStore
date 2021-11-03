import useSWR from "swr";
import { v4 as uuidv4 } from 'uuid';

/**
 * 取得待下載的連結數量
 *commic_url:requests
 chapter_url:requests
 * @return {*} 
 */
export const useRequestsCount = (keyName: string) => {
    const { data, error, mutate } = useSWR(`/api/logs/requests?requestId=${keyName}`,
        (url: string) => fetch(url, { method: 'POST', body: JSON.stringify({ keyName: keyName }) }).then((res) => res.json()),
        { refreshInterval: 10000 })
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}
