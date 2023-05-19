import useSWR from 'swr'
import { Category } from '../models/category';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useCategory = (id:number) => {
    const { data, error,mutate } = useSWR<Category[]>([`/api/category?id=${id}`], fetcher)

    return {
        data: data,
        isLoading: !error && !data,
        error: error,
        mutate: mutate
    }
}