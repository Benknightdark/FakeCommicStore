import type { NextPage } from 'next'
import useSWR from 'swr'
import React, { useState } from 'react'
import { useSubTitleContext } from '../context/sub-title-context'
import Loading from './utils/loading'
import { useRouter } from 'next/router'

import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Chapter: NextPage = () => {
    const theme = useTheme();
    const router = useRouter()
    const subTitleContext = useSubTitleContext()
    subTitleContext.updateSubTitle(router.query['subTitle']?.toString()!)
    const [open, setOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { data, error, mutate } = useSWR(`/api/chapter?url=${router.query['url']}`, fetcher, {
        revalidateOnFocus: false
    })
    const [selectData, updateSelectData] = useState<string[]>([])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const link = event.target.ariaLabel
        const checked = event.target.checked
        const title = event.target.ariaCurrent
        const newData = data.map((d: any) => {
            if (d.title == title) {
                d.checked = checked
            }
            return d
        })
        mutate([])
        mutate([...newData])
        const newLink = `${link}?subFolderName=${title}&rootFolderName=${router.query['subTitle']?.toString()!}`
        if (checked) {
            selectData.push(newLink)
            updateSelectData(selectData)
            console.log(selectData)
        } else {
            updateSelectData(selectData.filter(a => a !== newLink))
            console.log(selectData)
        }

    };

    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    return <div>
        {/* 浮動按鈕 */}
        <div style={{
            position: 'fixed',
            bottom: 40,
            right: 20,
            zIndex: 2231000,
        }}>
            <button type="button"
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 
            hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 shadow-lg
             shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium
             rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                }}
            >清除全部</button>

            <button type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 
            hover:bg-gradient-to-br focus:ring-4 focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 
            dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const allData = data.map((r: any) => `${r.link}?subFolderName=${r.title}&rootFolderName=${router.query['subTitle']?.toString()!}`)
                    console.log(allData)
                    const req = await fetch(`/api/download`, {
                        body: JSON.stringify(allData),
                        headers: {
                            'content-type': 'application/json'
                        },
                        method: 'POST',
                    })
                    const res = await req.text()
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                    console.log(res)
                    setOpen(true)
                }}
            >下載全部</button>
            <button type="button"
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br 
 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg
  dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={async () => {
                    const req = await fetch(`/api/download`, {
                        body: JSON.stringify(selectData), // must match 'Content-Type' header
                        headers: {
                            'content-type': 'application/json'
                        },
                        method: 'POST',
                    })
                    const res = await req.text()
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                    console.log(res)
                    setOpen(true)

                }}
            >下載</button>


        </div>
        {/* Alert Window */}
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                開始下載
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {router.query['subTitle']}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => setOpen(false)}>
                    關閉
                </Button>
            </DialogActions>
        </Dialog>
        {/* 漫畫章節列表 */}
        <div className="flex flex-col">
            <div className="fixed  top-20 animated z-50 w-full">
                <button
                    className="  py-2 px-4 mt-5 bg-red-300 rounded-lg text-white font-semibold hover:bg-red-600"
                    onClick={() => {
                        router.push(router.query['backUrl']?.toString()!)
                    }}
                >
                    回上一頁
                </button>
            </div>
            <div className=" flex flex-wrap pt-20">
                {data.map((d: any) => (
                    <div key={d.title} className="rounded-full py-3 px-6 ">
                        <div className="p-5 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-200">
                            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-purple-500 
                                            hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 
                                            hover:border-red-500 hover:ring-indigo-300 flex-1
                                            ">
                                <Checkbox
                                    checked={d.checked}
                                    inputProps={{ 'aria-label': d.link, 'aria-current': d.title }}
                                    onChange={handleChange} />
                                <h2 className="text-2xl font-bold  text-gray-800 text-center cursor-pointer	">
                                    {d.title}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
}
export default Chapter
