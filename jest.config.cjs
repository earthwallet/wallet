// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@earthwallet/ui-(keyring|settings)(.*)$': '<rootDir>/packages/ui-$1/src/$2',
    '@earthwallet/extension-(base|chains|dapp|inject|ui)(.*)$': '<rootDir>/packages/extension-$1/src/$2',
    // eslint-disable-next-line sort-keys
    '@earthwallet/extension(.*)$': '<rootDir>/packages/extension/src/$1',
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/extension/build',
    '<rootDir>/packages/extension-base/build',
    '<rootDir>/packages/extension-ui/build',
    '<rootDir>/packages/ui-keyring/build'
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@polkadot|@babel/runtime/helpers/esm/))']
};
