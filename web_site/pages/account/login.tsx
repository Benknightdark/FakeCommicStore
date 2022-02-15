import React from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useForm } from "react-hook-form";
// const { yupResolver } = require('@hookform/resolvers/yup')
import { yupResolver } from '@hookform/resolvers/yup';

import { object, string } from "yup";
import { FiSend } from 'react-icons/fi'
import { BsFillArrowRightSquareFill } from 'react-icons/bs'

const schema = object().shape({
    username: string().required("帳號不能為空值"),
    password: string().required("密碼不能為空值"),

}).required();

const Login: NextPage = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async (data: any) => {
        await signIn("credentials", data)
    };
    return (
        <div className="h-fit w-screen pt-20 ">
            <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
                <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0
                 border-8 border-purple-500 
                hover:shadow-md  transform hover:-translate-y-1 transition-all duration-200 hover:border-green-500 hover:ring-indigo-300
                ">
                    <div className="flex flex-col w-full md:w-1/2 p-4 ">
                        <div className="flex flex-col flex-1 justify-center mb-8               
                        ">
                            <h1 className="text-4xl text-center font-thin">登入</h1>
                            <div className="w-full mt-4">
                                <form className="form-horizontal w-3/4 mx-auto" method="post" onSubmit={handleSubmit(onSubmit)}>
                                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                                    <div className="mb-3">
                                        <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">帳號</label>
                                        <input type="text"
                                            className="block p-4 w-full text-gray-900 
                                bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 
                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"   id="userName"
                                            {...register("username")} />
                                        {errors.username?.message && <div className="text-red-600" role="alert">
                                            <p>{errors.username?.message}</p>
                                        </div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">密碼</label>
                                        <input type="password"
                                            className="block p-4 w-full text-gray-900 
                                bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 
                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500"   id="password"
                                            {...register("password")} />
                                        {errors.password?.message && <div className="text-red-600" role="alert">
                                            <p>{errors.password?.message}</p>
                                        </div>}
                                    </div>

                                    <div className="flex flex-col mt-8">
                                        <button type="submit" className="green-btn">
                                            <div className="flex space-x-2 justify-center">
                                                <span className="pr-1">登入</span>
                                                <FiSend className="h-4 w-4"></FiSend>
                                            </div>
                                        </button>
                                        <button type="button" className="purple-btn" onClick={() => {
                                            router.push('/account/register')
                                        }}>
                                            <div className="flex space-x-2 justify-center">
                                                <span className="pr-1">前往註冊頁面</span>
                                                <BsFillArrowRightSquareFill className="h-4 w-4"></BsFillArrowRightSquareFill>
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block md:w-1/2 " style={{
                        "background": "url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')",
                        "backgroundSize": "cover",
                        "backgroundPosition": "center center",
                    }}></div>
                </div>
            </div>
        </div>
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