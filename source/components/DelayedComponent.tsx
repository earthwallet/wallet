import React, { useState, useEffect } from 'react';

type Props = {
    children: React.ReactNode;
    waitBeforeShow?: number;
};

const DelayedComponent = ({ children, waitBeforeShow = 500 }: Props) => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShown(true);
        }, waitBeforeShow);
        return () => clearTimeout(timer);
    }, [waitBeforeShow]);

    return isShown ? children : null;
};

export default DelayedComponent;
