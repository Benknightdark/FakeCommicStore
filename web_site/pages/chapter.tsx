import type { NextPage } from 'next'
import useSWR from 'swr'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp';
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
            bottom: 20,
            right: 20,
            zIndex: 2231000,
        }}>
            <Fab variant="extended" color="primary" aria-label="add" style={{
                cursor: 'pointer',
                backgroundColor: 'red',
            }}
                onClick={async () => {
                    const newData = data.map((d: any) => {
                        d.checked = false
                        return d
                    })
                    mutate([])
                    mutate([...newData])
                }}
            >
                <HighlightOffSharpIcon sx={{ mr: 1 }} />
                清除全部
            </Fab>
            <Fab variant="extended" color="primary" aria-label="add" style={{
                cursor: 'pointer',
                backgroundColor: '#bbf2a0',
            }}
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
            >
                <CheckBoxSharpIcon sx={{ mr: 1 }} />
                下載全部
            </Fab>
            <Fab variant="extended" color="primary" aria-label="add" style={{

                cursor: 'pointer',
                backgroundColor: 'coral',

            }} onClick={async () => {
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

            }}>
                <DownloadIcon sx={{ mr: 1 }} />
                下載
            </Fab>
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
