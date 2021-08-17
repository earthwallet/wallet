import React from 'react';
import styles from './index.scss';
//import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';


interface Props extends RouteComponentProps<{ assetid: string }> {
    className?: string;
}

const NFTDetails = ({
    match: {
        params: {
            assetid,
        },
    },
}: Props) => {
    //const history = useHistory();

    return (
        <div className={styles.page}>
            <div className={styles.transCont}>
                {assetid}
            </div>
        </div>
    );
};

export default withRouter(NFTDetails);
