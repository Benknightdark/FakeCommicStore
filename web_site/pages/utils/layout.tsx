import React, { Fragment, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/dist/client/router";
import { SubTitleContext } from "../../context/sub-title-context";
import Button from "@mui/material/Button";
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
                <Container fixed sx={{ paddingTop: 10 }} maxWidth="xl">
                    <AppBar position="fixed" className='bg-yellow-500'>
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
                    </AppBar>
                    {children}
                </Container>
            </Fragment>
            <SwipeableDrawer
                anchor='left'
                open={openDrawer}
                onClose={() => { setOpenDrawer(false) }}
                onOpen={() => { setOpenDrawer(true) }}
            >
                <Drawler />
            </SwipeableDrawer>
        </SubTitleContext.Provider>
    );
}

export default Layout;