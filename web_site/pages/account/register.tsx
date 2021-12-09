/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, Theme, CardHeader, CardContent, InputLabel, Input, Button } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
const { yupResolver } = require('@hookform/resolvers/yup')
import {object,string} from "yup";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    })
);
const schema = object().shape({
    userName: string().required(),
    password: string().required(),
    email: string().required(),
    displayName: string().required(),

  }).required();
interface IFormInputs {
    userName: string
    password: string
    email: string
    displayName: string
}

//
const register: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const classes = useStyles();
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }  } = useForm({
        resolver: yupResolver(schema)
      });
    const onSubmit = async (data: { userName: any; password: any; }) => {
        console.log(data)
        // const req = await fetch("/api/auth/register", {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: { "content-type": "application/json" },
        // });
        // const res = await req.json();
        // console.log(res)
        // if (res?.token) {
        //     signIn("credentials", {
        //         username: data.userName,
        //         password: data.password,
        //         redirect: false,
        //     }).then((r) => {
        //         console.log(r)
        //     });
        // }

    };
    // justify="center"
    // alignItems="baseline"
    // direction="row"
    // className={classes.root}
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
                    <CardHeader title="註冊" className="gradient-red"></CardHeader>
                    <CardContent>
                        <form method="post"  onSubmit={handleSubmit(onSubmit)}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <InputLabel>帳號</InputLabel>
                            <Input
                                fullWidth={true}
                                type="text"
                                className="form-control"
                                id="userName"
                                {...register("userName")}
                            />
                            <InputLabel>密碼</InputLabel>
                            <Input
                                fullWidth={true}
                                type="password"
                                className="form-control"
                                id="password"
                                {...register("password")}

                            />
                            
                            <InputLabel>Email</InputLabel>
                            <Input
                                fullWidth={true}
                                type="email"
                                className="form-control"
                                id="email"
                                {...register("email")}

                            />

                            <InputLabel>顯示名稱</InputLabel>
                            <Input
                                fullWidth={true}
                                type="text"
                                className="form-control"
                                id="displayName"
                                {...register("displayName")}

                            />
                            <Button type="submit" variant="contained" color="primary">
                                送出
                            </Button>
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

export default register;