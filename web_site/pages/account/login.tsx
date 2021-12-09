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
    username: string().required(),
    password: string().required(),

}).required();
interface IFormInputs {
    username: string
    password: string
    email: string
    displayName: string
}
const Login: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const classes = useStyles();
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async (data: { userName: any; password: any; }) => {
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
                        <IconButton aria-label="settings" onClick={()=>{
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
                            <InputLabel>帳號</InputLabel>
                            <Input
                                fullWidth={true}
                                type="text"
                                className="form-control"
                                id="userName"
                                {...register("username")}
                            />
                            <InputLabel>密碼</InputLabel>
                            <Input
                                fullWidth={true}
                                type="password"
                                className="form-control"
                                id="password"
                                {...register("password")}

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
export default Login;