// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedMetadata, InjectedMetadataKnown, MetadataDef } from '@earthwallet/extension-inject/types';
import type { SendRequest } from './types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;

export default class Metadata implements InjectedMetadata {
  constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public get (): Promise<InjectedMetadataKnown[]> {
    return sendRequest('ewpub(metadata.list)');
  }

  public provide (definition: MetadataDef): Promise<boolean> {
    return sendRequest('ewpub(metadata.provide)', definition);
  }
}
