import useSWR from "swr";
const fetcher = (url: string, keyName: string,csrfToken:string) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ keyName: keyName }),
    headers: { 'x-csrf-token': csrfToken }
}).then((res) => res.json())
/**
 * 取得待下載的連結數量
 *commic_url:requests
 chapter_url:requests
 * @return {*} 
 */
export const useRequestsCount = (keyName: string,csrfToken:string='') => {
    const { data, error, mutate } = useSWR(
        [`/api/logs/requests?requestId=${keyName}`, keyName,csrfToken],
        fetcher,
        { refreshInterval: 10000 })
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}
