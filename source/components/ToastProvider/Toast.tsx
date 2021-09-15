import React from 'react';
import styles from './index.scss';

interface Props {
    content: React.ReactChild;
    visible: boolean;
    className?: string;
}

function Toast({ content, visible }: Props): React.ReactElement<Props> {
    return (
        <div className={visible ? styles.cont : styles.noop}>
            <p className={styles.content}>{content}</p>
        </div>
    );
}

export default Toast;