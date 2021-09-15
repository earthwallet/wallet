import React from 'react';

const noop = (): void => undefined;

const ToastContext = React.createContext<({ show: (message: string) => void })>({ show: noop });


export default ToastContext;