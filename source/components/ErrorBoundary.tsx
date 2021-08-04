// Copyright 2021 @earthwallet/extension-ui authors & contributor
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Header from '~components/Header';
import NextStepButton from '~components/NextStepButton';
import { withRouter, RouteComponentProps } from "react-router-dom";


interface Props {
    children: React.ReactNode;
    className?: string;
    error?: Error | null;
    trigger?: string;
}

interface State {
    error: Error | null;
}

// NOTE: This is the only way to do an error boundary, via extend
class ErrorBoundary extends React.Component<Props & RouteComponentProps> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { error };
    }

    componentDidUpdate(prevProps: Props) {
        const { error } = this.state;
        const { trigger } = this.props;

        if (error !== null && (prevProps.trigger !== trigger)) {
            this.setState({ error: null });
        }
    }

    goHome = () => {
        this.setState({ error: null });
        this.props.history.push('/home');
    };

    public render(): React.ReactNode {
        const { children } = this.props;
        const { error } = this.state;

        return error
            ? (
                <>
                    <Header text={'An error occured'} />
                    <div style={{ padding: '36px' }}>
                        {`Something went wrong with the query and rendering of this component. ${error.message}`}
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        margin: '20px 30px',
                    }}>

                        <NextStepButton
                            onClick={this.goHome}
                        >
                            {('Back to home')}
                        </NextStepButton>
                    </div>

                </>
            )
            : children;
    }
}

export default withRouter(ErrorBoundary);
