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

const Layout: NextPage = ({ children }) => {
    const router = useRouter()
    const [subTitle, setSubTitle] = useState<string>("");
    const startUrlsCountSWR = useStartUrlsCount("commic_url:start_urls")
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
                            <Typography className='hover:underline'
                                style={{
                                    cursor: 'pointer'
                                }}
                                variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => {
                                    router.push('/')
                                }}>
                                Fake Commic Store  {subTitle}
                            </Typography>
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