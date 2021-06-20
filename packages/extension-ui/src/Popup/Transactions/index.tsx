import styled from 'styled-components';
import type { ThemeProps } from '../../types';
import React from 'react';
import bg_wallet_details from '../../assets/bg_wallet_details.png';
import { RouteComponentProps, withRouter } from 'react-router';
//import { ActionContext } from '../../components';
import ICON_CARET from '../../assets/icon_caret.svg';
import ICON_RECV from '../../assets/icon_receive.svg';
import ICON_SEND from '../../assets/icon_send_status.svg';
import ICON_FAILED from '../../assets/icon_failed.svg';
import ICON_FORWARD from '../../assets/icon_forward.svg';
import { useHistory } from "react-router-dom";

interface Props extends RouteComponentProps<{address: string}>, ThemeProps {
    className?: string;
}
const MOCK = [{
    status: "Failed",
    time: "Jun 7",
    to: "0x4f2...0c90",
    value: "1.32464 ICP",
    price: "$4,652.33 USD"
    
    },
    {
    status: "Send",
    time: "Jun 7",
    to: "0x4f2...0c90",
    value: "2.997627 ICP",
    price: "$1,32.33 USD"
    },
    {
    status: "Receive",
    time: "Jun 7",
    to: "0x4f2...0c90",
    value: "2.997627 ICP",
    price: "$12,154.33 USD"
    }];
const Transactions = ({ className, match: { params: { address =  'ba01ff35bda94f7f54c231b03301512681bf742ab28032fefef6e299e087a21f'} } }: Props) => {
   // const onAction = useContext(ActionContext);
   const history = useHistory();

   const statusToIcon =  (status : string) => {
    switch (status) {
       case 'Receive':
          return ([
            <img src={ICON_RECV} />
            ,
          ]);
          case 'Send':
            return ([
                <img src={ICON_SEND} />
                ,
            ]);
            case 'Failed':
                return ([
                    <img src={ICON_FAILED} />
                    ,
                ]);
            default:
                    return <div />;
        }
 }
    return (
        <div className={className}>
     {/*        <Header
            text={'Transactions'}
            className={'header'}
            showAccountsDropdown
            showMenu
            type={'wallet'} /> */}
            
            <div className={'transCont'}>
            <div 
                          onClick={() => history.goBack()}

            className={'backTransButton'}>
            <img src={ICON_CARET} />

            <div className={'transTitle'}>Transactions</div>
            </div>
            <div className={'transItems'}>
            {[...MOCK, ...MOCK, ...MOCK].map((trans, index) =>  <div key={index} className={'transItem'}>
                <div className={'transColIcon'}>
                    {statusToIcon(trans.status)}
                </div>
                <div className={'transColStatus'}> 
                     <div>{ trans.status}</div>
                     <div className={'transSubColTime'}>
                         <div>{trans.time}</div>
                        <div className={'transSubColDot'}></div>
                        <div>to {trans.to}</div>
                     </div>
                </div>

                <div className={'transColValue'}> 
                    <div>
                         {trans.value}
                    </div>
                    <div className={'transSubColPrice'}>
                        {trans.price}
                    </div>
                </div>
                <div className={'transColAction'}>
                <img src={ICON_FORWARD} />
                </div>

            </div>)}
            </div>
            </div>
        </div>
    );
};



export default withRouter(styled(Transactions)`
width: auto;
display: flex;
flex-direction: column;
align-items: center;
height: -webkit-fill-available;
background: url(${bg_wallet_details});

.backTransButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.backTransButton:active {
    opacity: 0.7;
}

.transColIcon {
    margin-right: 8px;
}

.transCont {
    backdrop-filter: blur(7px);
    height: 568px;
    width: 343px;
    margin: 16px;
    border: 1px solid #2496FF;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    box-sizing: border-box;
    padding: 12px;
    overflow: hidden;
};

.transTitle {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    /* identical to box height, or 24px */
    
    text-align: center;
    
    /* Brand / Moonlight Grey / 100% */
    color: #E6E9ED;
    }

    .transItem {
        border-bottom : 1px solid #FFFFFF1A;
        padding: 23px 0;
        display: flex;
        width: calc(340px - 32px);
        overflow: hidden;
    }

    .transColStatus {
     display: flex;
     flex-direction: column;
     width: 133px;
     margin-right: 21px;
    }
    .transSubColTime {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 12px;
        /* identical to box height, or 100% */


        color: #FAFBFB;

        opacity: 0.54;
        display: flex;
        align-items: center;
    }

    .transSubColPrice {

        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 12px;
        /* identical to box height, or 100% */


        color: #FAFBFB;

        opacity: 0.54;
    }

    .transColAction {
       display: flex;
       align-self: center;
    }

    .transColValue {
        align-items: flex-end;
        margin-right: 16px;
        display: flex;
        flex-direction: column;
        text-align: end;
    }
    .transSubColDot { 
        width: 2px;
        height: 2px;
        border-radius : 6px;
        background: #989DA9;
    }

    .transItems {
        height: 502px;
        overflow: hidden scroll;
    }
`); 