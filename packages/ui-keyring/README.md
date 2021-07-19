# @earthwallet/ui-keyring

A wrapper extending the base @earthwallet/sdk interface for usage in the browser:
Key management of user accounts including generation and retrieval of keyring pairs from a variety of input combinations.

## Usage Examples

All module methods are exposed through a single default export.

### Regular

```js
import keyring from @earthwallet/ui-keyring

render () {
  const address = '5xxx';

  // get keyring pair from address
  const pair = keyring.getPair(address);

  // ask questions about that particular keyring pair
  const isLocked = pair.isLocked;
  const meta = pair.meta;

  // save account from pair
  keyring.saveAccount(pair, password);

  // save address without unlocking it
  keyring.saveAddress(address, { ...meta });
}
```

## Observables

Option 1: Declarative subscribe/unsubscribe w/ react-with-observable (recommended 'React' way)

```js
import accountObservable from '@earthwallet/ui-keyring/observable/accounts';
import { SingleAddress, SubjectInfo } from '@earthwallet/ui-keyring/observable/types';
import React from 'react';
import { Subscribe } from 'react-with-observable';
import { map } from 'rxjs/operators';

class MyReactComponent extends React.PureComponent {
  render () {
    <Subscribe>
      {accountObservable.subject.pipe(
        map((allAccounts: SubjectInfo) =>
          !allAccounts
            ? this.renderEmpty()
            : Object.values(allAccounts).map((account: SingleAddress) =>
                // Your component goes here
                console.log(account.json.address)
            )
        ))}
    </Subscribe>
  }

  renderEmpty () {
    return (
      <div> no accounts to display ... </div>
    );
  }
}

```

Option 2: Imperative subscribe/unsubscribe

```js
import accountObservable from '@earthwallet/ui-keyring/observable/accounts';
import { SingleAddress, SubjectInfo } from '@earthwallet/ui-keyring/observable/types';
import React from 'react';
import { Subscription } from 'rxjs';

type State = {
  allAccounts?: SubjectInfo,
  subscriptions?: [Subscription]
}

class MyReactComponent extends React.PureComponent<State> {
  componentDidMount () {
    const accountSubscription = accountObservable.subject.subscribe((observedAccounts) => {
      this.setState({
        accounts: observedAccounts
      });
    })

    this.setState({
      subscriptions: [accountSubscription]
    });
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    for (s in subscriptions) {
      s.subject.unsubscribe();
    }
  }

  render () {
    const { accounts } = this.state;

    return (
      <h1>All Accounts</h1>
      {
        Object.keys(accounts).map((address: SingleAddress) => {
          return <p> {address} </p>;
        })
      }
    )
  }
}
```

## FAQ

- Difference between Keyring Accounts and Addresses?
  - From the perspective of the keyring, it saves a particular user's unlocked identities as an account, a la keyring.saveAccount(pair, password). So with these accounts you are able to send and sign transactions.
  - To save addresses without unlocking them (i.e. because a user might want to have easy access to addresses they frequently transact with), use keyring.saveAddress(address, meta)

**If you have any unanswered/undocumented questions, please raise an issue [here](https://github.com/polkadot-js/ui/issues).**


## Users

Keyring is core to many polkadot/substrate apps.

* [polkadot-js/apps](https://github.com/polkadot-js/apps)
* [paritytech/substrate-light-ui](https://github.com/paritytech/substrate-light-ui)
