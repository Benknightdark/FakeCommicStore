import React, { Fragment, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/dist/client/router";
import { SubTitleContext } from "../../context/sub-title-context";
import DashboardIcon from '@mui/icons-material/Dashboard';
import Badge from "@mui/material/Badge";
import { useStartUrlsCount } from '../../helpers/starts-url-helper';
import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from "@mui/system/Box";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Paper from '@mui/material/Paper';
import ListItemButton from '@mui/material/ListItemButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { GiSpiderMask } from 'react-icons/gi'
import { AiOutlineBarChart, AiOutlineFullscreenExit } from "react-icons/ai";

import { signOut, useSession } from "next-auth/react";
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        // marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));
const FireNav = styled(List)<{ component?: React.ElementType }>({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});
const ShowMenuButton = styled('div')(({ theme }) => ({
    visibility: "hidden",
    [theme.breakpoints.down('md')]: {
        visibility: "visible",
    },

}));
const Layout: NextPage = ({ children }) => {
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState(false)
    const [subTitle, setSubTitle] = useState<string>("");
    const startUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls")
    const session = useSession();
    const updateSubTitle = (text: string) => {
        if (text !== '')
            setSubTitle(` / ${text}`)
        else
            setSubTitle(``)
    };
    const Drawler = () => {
        return <Box sx={{ display: 'flex' }} >
            <ThemeProvider
                theme={createTheme({
                    components: {
                        MuiListItemButton: {
                            defaultProps: {
                                disableTouchRipple: true,
                            },
                        },
                    },
                    palette: {
                        mode: 'dark',
                        primary: { main: 'rgb(102, 157, 246)' },
                        background: { paper: 'rgb(5, 30, 52)' },
                    },
                })}
            >
                <Paper className='h-screen' elevation={0} sx={{ maxWidth: 300 }}>
                    <FireNav component="nav" disablePadding>
                        {/* Banner Title */}
                        <ListItemButton onClick={() => {
                            setOpenDrawer(false)
                            router.push('/')
                        }}>
                            <ListItemIcon sx={{ fontSize: 20 }}>🔥</ListItemIcon>
                            <ListItemText
                                sx={{ my: 0 }}
                                primary="Fake Commic Store"
                                primaryTypographyProps={{
                                    fontSize: 20,
                                    fontWeight: 'medium',
                                    letterSpacing: 0,
                                }}
                            />
                        </ListItemButton>
                        <Divider />
                        <ListItem component="div" disablePadding>
                        </ListItem>
                        <Divider />
                        <Box>
                            {/* Banner SubTitle */}
                            <ListItemButton
                                alignItems="flex-start"
                                sx={{
                                    px: 3,
                                    pt: 2.5,
                                    // pb: open ? 0 : 2.5,
                                }}
                            >
                                <ListItemText
                                    primary="Distributed Crawler X Commic Downloader"
                                    primaryTypographyProps={{
                                        fontSize: 15,
                                        fontWeight: 'medium',
                                        lineHeight: '20px',
                                        mb: '2px',
                                    }}
                                    secondary="⚡Download your favorite commic faster⚡"
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        //   color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                                    }}
                                    sx={{ my: 0 }}
                                />
                                <KeyboardArrowDown
                                    sx={{
                                        mr: -1,
                                        opacity: 0,
                                        transition: '0.2s',
                                    }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                key="dashboard"
                                sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                                onClick={
                                    () => {
                                        setOpenDrawer(false)
                                        router.push('/dashboard')
                                    }}
                            >
                                <ListItemIcon sx={{ color: 'inherit' }}>
                                    <DashboardIcon></DashboardIcon>
                                </ListItemIcon>
                                <ListItemText
                                    primary="dashboard"
                                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                                />
                            </ListItemButton>
                        </Box>
                    </FireNav>
                </Paper>
            </ThemeProvider>
        </Box>
    }
    return (
        <SubTitleContext.Provider value={{ updateSubTitle }}>
            <Fragment>
                <Head>
                    <title>Fake Commic Store</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    />
                </Head>
                <div className="flex flex-col h-screen">
                    <header className="dark:bg-indigo-600 bg-yellow-300  w-full" >
                        <div className="p-3">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="w-0 flex-1 flex items-center">
                                    <span className="flex p-2 rounded-lg dark:bg-indigo-800 bg-yellow-600">
                                        <GiSpiderMask className="h-6 w-6 text-white cursor-pointer" aria-hidden="true"
                                            onClick={
                                                () => {
                                                    router.push('/')
                                                }
                                            }
                                        ></GiSpiderMask>
                                    </span>
                                    <p className="ml-3 font-medium text-white truncate">
                                        <span className='dark:text-white text-black hover:font-bold'>🔥Fake Commic Store  {subTitle}</span>
                                    </p>
                                </div>
                                <div className="justify-end flex-row">
                                    <div className="p-4 
                                      hidden  md:inline-block xl:inline-block lg:inline-block 2xl:inline-block">
                                        <label htmlFor="table-search" className="sr-only">Search</label>
                                        <div className="relative mt-1">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                                            </div>
                                            <input type="text" id="table-search" className="bg-gray-50 border
                                             border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                              focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700
                                               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                               dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="搜尋漫畫" />
                                        </div>
                                    </div>
                                    <button type='button' className='green-btn
                                     hidden  md:inline-block xl:inline-block lg:inline-block 2xl:inline-block'
                                        onClick={
                                            () => {
                                                router.push('/dashboard')
                                            }
                                        }
                                    >
                                        <div className="flex space-x-2">
                                            <AiOutlineBarChart className='text-gray-100 dark:text-gray-800 h-5 w-5'></AiOutlineBarChart>
                                            下載進度查詢
                                            {
                                                !startUrlsCountSWR.isLoading && <span className="bg-red-100 text-red-800 text-sm font-medium 
                                                mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">{startUrlsCountSWR.data['count']}</span>
                                            }

                                        </div>
                                    </button>
                                    {session.status == 'unauthenticated' && (
                                        <button className='grow  blue-btn' onClick={() => { router.push("/account/login") }}>登入</button>
                                    )

                                    }
                                    {session.status == 'authenticated' &&
                                        <button type='button' className='grow  blue-btn'
                                            onClick={() => { signOut() }}>
                                            {session?.data?.user?.name}</button>
                                    }


                                    {session.status == 'authenticated' &&
                                        <button className='grow red-btn' onClick={() => { router.push("/favorite") }}>我的最愛</button>
                                    }


                                </div>
                            </div>
                        </div>
                    </header>
                    <div className=" bg-slate-50 dark:bg-black flex-1 overflow-y-auto">

                        {children}

                    </div>
                    <footer className="py-5 bg-gray-700 text-center text-white">
                        made by ben 😎
                    </footer>
                </div>

            </Fragment>
            {/* <SwipeableDrawer
                anchor='left'
                open={openDrawer}
                onClose={() => { setOpenDrawer(false) }}
                onOpen={() => { setOpenDrawer(true) }}
            >
                <Drawler />
            </SwipeableDrawer> */}
        </SubTitleContext.Provider>
    );
}

export default Layout;


{/* <AppBar position="fixed" className='bg-yellow-500'>
                        <Toolbar>
                            <ShowMenuButton>
                                <IconButton edge="start" color="inherit" aria-label="menu"
                                    onClick={() => { setOpenDrawer(true) }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </ShowMenuButton>
                            <Typography className='invisible hover:underline  md:visible xl:visible lg:visible 2xl:visible'
                                style={{
                                    cursor: 'pointer'
                                }}
                                variant="h6" component="div" sx={{ flexGrow: 1 }}

                                onClick={() => {
                                    router.push('/')
                                }}>
                                🔥Fake Commic Store  {subTitle}
                            </Typography>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="搜尋漫畫"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onBlur={async (value) => {
                                        const subTitle = value.currentTarget.value
                                        if (subTitle.replace(/\s/g, "") == "") {
                                            router.push({ pathname: '/' })
                                            return
                                        }
                                        setTimeout(() => {
                                            const link = `https://www.comicun.com/search-index?q=${subTitle}`
                                            router.push({ pathname: '/commic', query: { url: link, subTitle: subTitle } })
                                        }, 500);

                                    }}
                                />
                            </Search>
                            {session.status == 'unauthenticated' && <Button variant="contained" color="secondary" onClick={() => { router.push("/account/login") }}>登入</Button>}
                            {session.status == 'authenticated' && <Button variant="contained" color="success" onClick={() => { signOut() }}>{session.data.user?.name}</Button>}
                            {session.status == 'authenticated' && <Button variant="contained" color="primary" onClick={() => { router.push("/favorite") }}>我的最愛</Button>}

                            <Button
                                className='invisible  md:visible xl:visible lg:visible 2xl:visible'
                                color="inherit" variant="outlined" endIcon={
                                    <Badge
                                        badgeContent={!startUrlsCountSWR.isLoading && startUrlsCountSWR.data['count']}
                                        color="secondary">
                                        <DashboardIcon />
                                    </Badge>}

                                onClick={
                                    () => {
                                        router.push('/dashboard')
                                    }
                                }>
                                Dashboard</Button>
                        </Toolbar>
                    </AppBar> */}