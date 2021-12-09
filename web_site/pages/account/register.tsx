import React from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, Theme, CardHeader, CardContent, InputLabel, Input, Button,IconButton } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
const { yupResolver } = require('@hookform/resolvers/yup')
import { object, string } from "yup";
import LoginIcon from '@mui/icons-material/Login';
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
    email: string().required(),
    displayName: string().required(),

}).required();
interface IFormInputs {
    username: string
    password: string
    email: string
    displayName: string
}

//
const Register: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const classes = useStyles();
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async (data: any) => {
        console.log(data)
        const req = await fetch("/api/account/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "content-type": "application/json" },
        });
        if (req.status===200){
             signIn("credentials", {
                username: data.username,
                password: data.password,
            })
        }else{
            const message=(await req.json());
           alert(message['message']) 
        }
        

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
                    <CardHeader title="註冊" className="gradient-red"  action={
                        <Tooltip title="前往登入頁面">
                        <IconButton aria-label="settings" onClick={()=>{
                            router.push('/account/login')
                        }}>
                          <LoginIcon />
                        </IconButton>
                        </Tooltip>
                      }></CardHeader>
                    <CardContent>
                        <form method="post" onSubmit={handleSubmit(onSubmit)}>
                            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                            <InputLabel>帳號</InputLabel>
                            <Input
                                fullWidth={true}
                                type="text"
                                className="form-control"
                                id="username"
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

export default Register;