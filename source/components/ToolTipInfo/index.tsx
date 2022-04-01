
import React from 'react';
import styles from './index.scss';
import ArrowToolTip from '~components/ArrowToolTip';


const ToolTipInfo = ({ title, placement }: { title: string, placement?: string }) =>
    <ArrowToolTip title={title} placement={placement || "bottom-start"}>
        <div className={styles.cont}>?</div>
    </ArrowToolTip>


export default ToolTipInfo