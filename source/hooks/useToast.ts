

import { useContext } from 'react';

import ToastContext from '~components/ToastProvider/ToastContext';

export default function useToast(): { show: (message: string) => void } {
    return useContext(ToastContext);
}