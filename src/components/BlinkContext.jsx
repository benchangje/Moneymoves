import { createContext, useContext, useState } from 'react';

const BlinkContext = createContext();

export const BlinkProvider = ({ children }) => {
    const [blinkKey, setBlinkKey] = useState(Date.now());

    const handlePageBlink = () => {
        setBlinkKey(Date.now());
    };

    return (
        <BlinkContext.Provider value={{ blinkKey, handlePageBlink }}>
            {children}
        </BlinkContext.Provider>
    );
}; 
export const useBlink = () =>  useContext(BlinkContext);
