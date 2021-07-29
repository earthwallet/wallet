

import React from 'react';
import { Input as Ip, TextField } from '@material-ui/core';

interface ComponentProps {
    withError?: boolean;
    readOnly?: boolean;
    type?: string;
    className?: string;
    placeholder?: string;
}
import styles from './index.scss';

type IpProps = React.ComponentProps<typeof Ip> & ComponentProps;
type TaProps = React.ComponentProps<typeof TextField> & ComponentProps;
import clsx from 'clsx';


const _Input = ({ type, withError }: IpProps) => <input type={type} className={clsx(styles.input, withError && styles.errorinput)} />;
const _TextArea = ({ className, withError, placeholder }: TaProps) => <textarea placeholder={placeholder} className={clsx(className, styles.textarea, withError && styles.errortextarea)} />;

export const TextArea = _TextArea;
export const Input = _Input;
