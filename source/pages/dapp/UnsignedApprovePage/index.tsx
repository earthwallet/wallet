import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useCurrentDapp, useCurrentDappAddress, useUnsignedApprove } from '~hooks/useController';
import ActionButton from '~components/composed/ActionButton';
import { useController } from '~hooks/useController';
import { useSelector } from 'react-redux';
import { safeParseJSON, stringifyWithBigInt } from '~global/helpers';
import { ClipLoader } from 'react-spinners';
import { selectRequestStatusById } from '~state/dapp';
import clsx from 'clsx';
import { getShortAddress } from '~utils/common';
import ICON_ICP from '~assets/images/icon_icp_details.png';


const UnsignedApprovePage = () => {

  const dapp = useCurrentDapp();
  const requestId = window.location.hash?.substring(1);
  const requestStatus = useSelector(selectRequestStatusById(requestId));
  const activeAccountAddress = useCurrentDappAddress();

  const controller = useController();
  const request = controller.dapp.getSignatureRequest();
  const unsignedApprove = useUnsignedApprove();




  const handleCancel = () => {
    window.close();
  };


  const handleUnsignApprove = async () => {


    await unsignedApprove();
    window.close();

  };

  useEffect(() => {
    if (requestStatus?.complete) {
      const body = document.querySelector('#response');

      body?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [requestStatus?.complete]);

  return <div
    className={clsx(styles.page, !(requestStatus?.loading || requestStatus?.complete) && styles.page_extra)}>
    <div
      id={'response'}
      className={styles.title}>{request?.type === 'updateSession' ? 'Update Session' : request?.type}</div>
    {requestStatus?.response && <div className={clsx(styles.accountInfo, styles.response, safeParseJSON(requestStatus?.response)?.type == 'error' && styles.errorResponse)}>
      <div
        className={styles.label}>
        Response</div>
      <div className={clsx(styles.value, styles.valueMono)}>
        {typeof requestStatus?.response === 'string' ? requestStatus?.response : stringifyWithBigInt(requestStatus?.response)}
      </div>
    </div>}
    <div className={styles.accountInfo}>
      <div className={styles.accountInfoKey}>Origin</div>
      <div className={styles.accountInfoValCont}>
        <div className={styles.accountInfoIcon}>
          <img src={dapp?.logo} className={styles.accountInfoIcon24} />
        </div>
        <div className={styles.accountInfoVal}>{dapp?.origin}</div>
      </div>

      <div className={styles.accountInfoKey}>Account</div>
      <div className={styles.accountInfoValCont}>
        <div className={styles.accountInfoIcon}>
          <img src={ICON_ICP} className={styles.accountInfoIcon24} />
        </div>
        <div className={styles.accountInfoVal}>{activeAccountAddress && getShortAddress(activeAccountAddress)}</div>
      </div>
    </div>

    {request?.type === 'disconnect' ?
      <div className={styles.requestBody}>
        <div className={clsx(styles.label, styles.labelinline)}>
          <span className={styles.accountInfoIcon}>
            <img src={dapp?.logo} className={styles.accountInfoIcon24} />
          </span> {dapp?.origin} is requesting to disconnect from {activeAccountAddress && getShortAddress(activeAccountAddress)}
        </div>
        <div className={styles.value}>
          Disconnecting will clear your existing transaction history log with this dapp.
        </div>
      </div>
      : request?.type === 'updateSession'
        ? <div className={styles.requestBody}>
          <div className={styles.label}>
            CanisterIds
          </div>
          <div className={styles.value}>
            {request?.canisterIds?.length > 0 && request?.canisterIds.map((canisterId: string) => <div className={styles.canisterid} key={canisterId}>{canisterId}</div>)}
          </div>
        </div>
        : Array.isArray(request)
          ? request.map((singleReq, index) => <div key={index} className={styles.requestBody}>
            <div className={styles.label}>
              CanisterId
            </div>
            <div className={styles.value}>
              {singleReq?.canisterId}
            </div>
            <div className={styles.label}>
              Method
            </div>
            <div className={clsx(styles.value, styles.valueMono)}>
              {singleReq?.method}
            </div>
            <div className={styles.label}>
              Message
            </div>
            <div className={clsx(styles.value, styles.valueMono)}>
              {singleReq?.args === undefined ? 'undefined' : stringifyWithBigInt(singleReq?.args)?.length > 1000 ? stringifyWithBigInt(singleReq?.args)?.substring(0, 1000) + '...' : stringifyWithBigInt(singleReq?.args)}
            </div>
          </div>)
          : <div className={styles.requestBody}>
            <div className={styles.label}>
              CanisterId
            </div>
            <div className={styles.value}>
              {request?.canisterId}
            </div>
            <div className={styles.label}>
              Method
            </div>
            <div className={clsx(styles.value, styles.valueMono)}>
              {request?.method}
            </div>
            <div className={styles.label}>
              Message
            </div>
            <div className={clsx(styles.value, styles.valueMono)}>
              {request?.args === undefined ? 'undefined' : stringifyWithBigInt(request?.args)?.length > 1000 ? stringifyWithBigInt(request?.args)?.substring(0, 1000) + '...' : stringifyWithBigInt(request?.args)}
            </div>
          </div>}

    {requestStatus?.loading ? <section className={styles.footerSuccess}>
      <ClipLoader color={'#fffff'}
        size={15} />
    </section>
      : requestStatus?.complete ?
        <section className={styles.footerSuccess}>
          <ActionButton
            onClick={() => window.close()}>
            &nbsp;&nbsp;&nbsp;Transaction Complete!&nbsp;&nbsp;&nbsp;
          </ActionButton>
        </section> :
        <section className={styles.footerSmall}>

          <div className={styles.actions}>
            <ActionButton actionType="secondary" onClick={handleCancel}>
              Cancel
            </ActionButton>
            <ActionButton
              onClick={handleUnsignApprove}>
              Approve
            </ActionButton>
          </div>
        </section>}

  </div>;
};

export default UnsignedApprovePage;
