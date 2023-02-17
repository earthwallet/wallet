import React, { useReducer } from 'react';
import styles from './index.scss';
import ICON_CHECKED from '~assets/images/icon_check.svg';

import Header from '~components/Header';
import clsx from 'clsx';
import i18n, { translationsLabels } from '~i18n/index';
import { useController } from '~hooks/useController';


const LangSettings = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const controller = useController();

  function handleLangSelect(lang: string) {
    i18n.locale = lang;

    controller.updateLanguage(lang);
    forceUpdate();
  }

  return (
    <div className={styles.page}>
      <Header type={'wallet'} text={''}>
        <div className={styles.empty} />
      </Header>
      <div className={styles.myAc}>
        Language Setting
      </div>
      <div className={styles.container}>
        <div className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}>
          {Object.keys(i18n.translations).sort((a, b) => translationsLabels[a as keyof typeof translationsLabels].localeCompare(translationsLabels[b as keyof typeof translationsLabels])).map((lang: string, index: number) =>
            <div
              onClick={() => handleLangSelect(lang)}
              key={index}
              className={styles.checkboxCont}
            >
              <div className={styles.checkboxContent}>
                <div>
                  <div className={styles.checkboxTitle}>
                    {translationsLabels[lang as keyof typeof translationsLabels] || lang.toLocaleUpperCase()}
                  </div>

                </div>
              </div>
              {lang == i18n.locale && <img
                className={styles.checkboxIcon}
                src={ICON_CHECKED}
              />}
            </div>)
          }
        </div>
      </div>
    </div>
  );
};

export default LangSettings;
