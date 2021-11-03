import { ButtonColorProps, useButtonStyles } from "./styles/button-style";
import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { ReactElement } from "react";
export const GradientButton=(props: ButtonColorProps & Omit<MuiButtonProps, keyof ButtonColorProps>):ReactElement =>{
    const { color, ...other } = props;
    const classes = useButtonStyles(props);
    return <Button className={classes.btnColor} {...other} />;
}