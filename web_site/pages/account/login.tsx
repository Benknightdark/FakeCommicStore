import React from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, Theme, CardHeader, CardContent, InputLabel, Input, Button, IconButton } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
const { yupResolver } = require('@hookform/resolvers/yup')
import { object, string } from "yup";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    })
);
const schema = object().shape({
    username: string().required("帳號不能為空值"),
    password: string().required("密碼不能為空值"),

}).required();

const Login: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const classes = useStyles();
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async (data: any) => {//{ userName: any; password: any; }
        console.log(data)
        await signIn("credentials", data)

    };
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="baseline"
            direction="row"
            spacing={2}
            className={classes.root}
        >
            <Grid item xs={12} md={6}>
                <Card className="card">
                    <CardHeader title="登入" className="gradient-red"
                        action={
                            <Tooltip title="前往註冊頁面">
                                <IconButton aria-label="settings" onClick={() => {
                                    router.push('/account/register')
                                }}>
                                    <AppRegistrationIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    ></CardHeader>
                    <CardContent>
                        <form method="post" onSubmit={handleSubmit(onSubmit)}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <div className="mb-3">
                                <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">帳號</label>
                                <input type="text"
                                    className="block p-4 w-full text-gray-900 
                                bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 
                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"   id="userName"
                                    {...register("username")} />
                            </div>
                            {errors.username?.message && <div className="red-alert" role="alert">
                                <p>{errors.username?.message}</p>
                            </div>}
                            <div className="mb-3">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">密碼</label>
                                <input type="password"
                                    className="block p-4 w-full text-gray-900 
                                bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 
                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"   id="password"
                                    {...register("password")} />
                            </div>
                            {errors.password?.message && <div className="red-alert" role="alert">
                                <p>{errors.password?.message}</p>
                            </div>}
                            <button type="submit" className="green-btn">
                                送出
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {
            csrfToken: await getCsrfToken(ctx)
        }
    }
}
export default Login;