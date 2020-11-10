# react-outpost
⚛️ 📨 [**Outpost**](https://outpost-protocol.com) is a utility to help serve decentralized media using [**Arweave**](https://www.arweave.org/) to audiences who are in possession of a particular cryptocurrency. This [**React**](https://reactjs.org/) SDK helps you to easily integrate and distribute content via Outpost to social token holders in your own applications.

Find out more about the motivation behind Outpost [**here**](https://outpost-protocol.com/outpost).

Supports [**Android**](https://reactnative.dev/), [**iOS**](https://reactnative.dev/), [**Web**](https://github.com/necolas/react-native-web) and [**Expo**](https://expo.io/). ✨

If you'd like more information about Outpost, or to host your own community, please drop into the [**Outpost Discord**](https://discord.gg/GZzSddx)!

## 🚀 Getting Started
Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-outpost
```

Using [**npm**](https://npmjs.com):

```sh
npm i -s react-outpost
```

## ✏️ Tutorial

To interface with [**Outpost**](https://outpost-protocol.com), you must declare an [`<OutpostProvider/>`](./src/providers/OutpostProvider.tsx) at the root of your application, which expects a single function [**prop**](https://reactjs.org/docs/components-and-props.html), `onRequestSignMessage`, which is used to safely validate the user's social token ownership. In this callback, you can use a variety of ways to sign a message, for example [**Ethers**](https://github.com/ethers-io/ethers.js/) or [**WalletConnect**](https://walletconnect.org).

```typescript
import React, { useCallback, useState } from 'react';
import Outpost from 'react-outpost';

import signPersonalMessage from "...";

export default function App(): JSX.Element {
  const onRequestSignMessage = useCallback(async (address: string, signInToken: string) => {
    return signPersonalMessage([
      signInToken,
      address,
    ]);
  }, []);
  return (
    <Outpost onRequestSignMessage={onRequestSignMessage}>
      {/* TODO: awesome decentralized app */}
    </Outpost>
  );
}
```

Once you're done, it's simple to interact with Outpost using the exposed [**hooks**](./src/hooks/index.ts). For example, you can list all Outpost communities:

```javascript
import { useAllCommunities } from 'react-outpost';

const { loading, error, communities } = useAllCommunities();
```

Or authenticate with Outpost to access secure content:

```javascript
import { useOutpost } from 'react-outpost';

const { requestAuthToken } = useOutpost();
const authToken = await requestAuthToken(`0xdeadbeef`);
```

And you can even upload an image using the [`useOutpost`](./src/hooks/useOutpost.ts) hook, which internally wraps the [**Outpost SDK**](https://github.com/OutpostProtocol/outpost-sdk):

```javascript
import { useOutpost } from 'react-outpost';

const { uploadImage } = useOutpost();
await uploadImage({
  authToken,
  base64: `data:image/png;base64,aGVsbG8sd29ybGQ...`,
});
```

You can check out the complete example application using [**WalletConnect**](https://walletconnect.org) as a message signer in React Native [here](./example).

## 🦄 API

### `OutpostProvider`

A React [**Context**]() Provider used to define the signing mechanism for Outpost [**Auth Challenges**](https://github.com/OutpostProtocol/outpost-sdk#getchallenge).

#### Prop Types
| **Name**           | **Type**                              | **Default**                            | **Description**                                                       |
|--------------------|---------------------------------------|----------------------------------------|-----------------------------------------------------------------------|
| `baseUrl`          | `string`                              | `https://outpost-api-v2.herokuapp.com` | URL of the Outpost Server.                                            |
| `requestAuthToken` | `(string address) => Promise<string>` | `Promise.reject()`                     | Provides the ability to sign a message for a given Ethereum `address` |

### `useOutpost`

A utility hook used to return the complete Outpost [**Client API**](https://github.com/OutpostProtocol/outpost-sdk) to a React Component nested within the `OutpostProvider`.

```typescript
type createClientResult = {
  readonly getAllCommunities: () => Promise<readonly Community[]>;
  readonly getPosts: (params: getPostsParams) => Promise<getPostsResult>;
  readonly getChallenge: (
    params: getChallengeParams
  ) => Promise<getChallengeResult>;
  readonly getAuthToken: (
    params: getAuthTokenParams
  ) => Promise<getAuthTokenResult>;
  readonly getPostPreview: (
    params: getPostPreviewParams
  ) => Promise<getPostPreviewResult>;
  readonly uploadImage: (
    params: uploadImageParams
  ) => Promise<uploadImageResult>;
  readonly uploadPost: (params: uploadPostParams) => Promise<uploadPostResult>;
  readonly uploadComment: (
    params: uploadCommentParams
  ) => Promise<uploadCommentResult>;
  readonly getPost: (params: getPostParams) => Promise<getPostResult>;
};
```

```typescript
type OutpostContextValue = createClientResult & {
  readonly baseURL: string;
  readonly requestAuthToken: (address: string) => Promise<string>;
};
```

```typescript
readonly useOutpost(): OutpostContextValue;
```

### `useAllCommunities`

Returns a list of all currently registered [Community](https://github.com/OutpostProtocol/outpost-sdk#getallcommunities)s on Outpost.

```typescript
readonly useAllCommunities: () => useAllCommunitiesResult;
```

```typescript
export type useAllCommunitiesResult = {
  readonly loading: boolean;
  readonly communities: readonly Community[];
  readonly error: null | Error;
};
```

### `usePosts`

Returns a list of all [Post](https://github.com/OutpostProtocol/outpost-sdk#getposts)s for a Community.

```typescript
readonly getPosts: (params: usePostsParams) => usePostsResult;
```

```typescript
export type usePostsParams = {
  readonly slug: string;
};
```

```typescript
export type usePostsResult = {
  readonly posts: readonly Post[];
  readonly loading: boolean;
  readonly error: null | Error;
};
```

### `useTxIdToUri`

A helper utility that converts an Arweave Transaction Id (`txId`) to a navigable `URL`, based upon the provided `gateway`.

```typescript
readonly useTxIdToUri: () => useTxIdToUriResult;
```

```typescript
export type useTxIdToUriResult = {
  readonly txIdToUri: (gateway: string, txId: string) => string;
};
```

## ✌️ License
[**MIT**](./LICENSE)
