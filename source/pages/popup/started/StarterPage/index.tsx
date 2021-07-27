import React from 'react';

import styles from './index.scss';
import { useHistory } from 'react-router-dom';

const StarterPage = () => {
  const history = useHistory();

  return <div className={styles.page}>
   
   <h1> Welcome to Starter Page </h1>
   <div
   className={styles.link}
      onClick={() => history.push(`/auth-list`)}
    >
      Go to Home Page
    </div>
  </div>;
};

export default StarterPage;
