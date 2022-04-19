import useSWR from "swr";
const fetcher = (url: string, keyName: string, csrfToken: string) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ keyName: keyName }),
    headers: { 'x-csrf-token': csrfToken }
}).then((res) => res.json())
/**
 * 取得正要下載的網頁數量
 * commic_url:start_urls
 * chapter_url:start_urls
 * @return {*} 
 */
export const useStartUrlsCount = (keyName: string, csrfToken: string = '') => {
    const { data, error, mutate } = useSWR([`/api/logs/start-urls?requestId=${keyName}`, keyName, csrfToken],
        fetcher,
        { refreshInterval: 10000 })
    return {
        data: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}

