import {  createContext, useContext, useState } from 'react';
type SubTitleContextActions = {
    updateSubTitle: (text: string) => void;
};
export const SubTitleContext = createContext<SubTitleContextActions>({ updateSubTitle: () => { } });

export const useSubTitleContext = () => {
    const context = useContext(SubTitleContext);
    return context
}