import { makeStyles } from '@mui/styles';
// import Button, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
export interface ButtonColorProps {
    color: 'red' | 'blue' | 'green';
}
const getCustomColor = (colors: ButtonColorProps) => {
    let gradientColor = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    let boxShow = '0 3px 5px 2px rgba(255, 105, 135, .3)'

    switch (colors.color) {

        case 'blue':
            gradientColor = 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            boxShow = '0 3px 5px 2px rgba(33, 203, 243, .3)'
            break;
        case 'green':
            gradientColor = 'linear-gradient(45deg, #DCEDC1 30%, #DCEDC1 90%)'
            boxShow = '0 3px 5px 2px rgba(33, 203, 243, .3)'
            break;
        case 'red':
        default:
            break;

    }
    return [gradientColor, boxShow];
}
export const useButtonStyles = makeStyles({
    btnColor: {
        background: (props: ButtonColorProps) => getCustomColor(props)[0],
        border: 0,
        borderRadius: 3,
        boxShadow: (props: ButtonColorProps) => getCustomColor(props)[1],
        color: 'white',
        height: 48,
        padding: '0 30px',
        margin: 8,
    },
});