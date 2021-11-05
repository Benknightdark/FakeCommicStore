import { Fragment, useState } from "react";
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
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
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
const Layout: NextPage = ({ children }) => {
    const router = useRouter()
    const [subTitle, setSubTitle] = useState<string>("");
    const startUrlsCountSWR = useStartUrlsCount("chapter_url:start_urls")
    const updateSubTitle = (text: string) => {
        if (text !== '')
            setSubTitle(` / ${text}`)
        else
            setSubTitle(``)
    };

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
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
                                className='md:hidden xl:hidden lg:hidden 2xl:hidden'
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography className='invisible hover:underline  md:visible xl:visible lg:visible 2xl:visible'
                                style={{
                                    cursor: 'pointer'
                                }}
                                variant="h6" component="div" sx={{ flexGrow: 1 }}

                                onClick={() => {
                                    router.push('/')
                                }}>
                                Fake Commic Store  {subTitle}
                            </Typography>
                            <Search >
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

                            <Button color="inherit" variant="outlined" endIcon={
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
        </SubTitleContext.Provider>
    );
}

export default Layout;