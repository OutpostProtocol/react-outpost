import React, { useState } from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { Community } from "outpost-sdk/build/main/lib/requests/getPosts";
import Collapsible from "react-native-collapsible";
import { useWalletConnect } from "react-native-walletconnect";
import { useTokenBalance } from "react-use-etherscan";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { useTxIdToUri, usePosts } from "../lib";
import { useCurrentAddress } from "../hooks";

export type CommunityCardProps = {
  readonly community: Community;
};

function CommunityCard({ community, ...extraProps }) {
  const { getCurrentAddress } = useCurrentAddress();
  const {
    slug,
    name,
    tokenSymbol,
    tokenAddress,
    imageTxId,
    description,
    owner: { name: ownerName },
    showOwner,
   } = community;
  const { txIdToUri } = useTxIdToUri();
  const { posts } = usePosts({ slug });
  const [collapsed, setCollapsed] = useState(true);

  const address = getCurrentAddress();
  const { result } = useTokenBalance({
    address,
    tokenName: "",
    contractAddress: tokenAddress,
  });

  const usersTokenBalance = result ? parseInt(result) : 0;

  return (
    <>
      <Card {...extraProps}>
        <Card.Title
          title={`${name}${showOwner ? ` by ${ownerName}` : ''}`}
          subtitle={description}
        />
        <Card.Cover source={{ uri: txIdToUri(imageTxId) }} />
        <Card.Actions style={{ justifyContent: "space-between" }}>
          <Button color="black" onPress={() => setCollapsed(e => !e)}>
            {collapsed ? `REVEAL POSTS` : `COLLAPSE POSTS`}
          </Button>
          {!!tokenAddress && !!tokenSymbol && (
            <Button mode="contained">{`Buy $${tokenSymbol}`}</Button>
          )}
        </Card.Actions>
      </Card>
      <Collapsible collapsed={collapsed}>
        {posts.map(({ title, subtitle, readRequirement, ...extras }, i) => {
          const canReadDocument = readRequirement <= usersTokenBalance;
          const conditionalProps = !canReadDocument ? {
            leftStyle: {
              width: 20,
            },
            left: () => (
              <MaterialCommunityIcons
                size={20}
                color="black"
                name="lock"
              />
            ),
          } : {};
          // So we need some kind of abstract canRead.
          return (
            <TouchableOpacity
              disabled={!canReadDocument}
              key={i}
            >
              <Card>
                <Card.Title
                  {...conditionalProps}
                  title={title}
                  subtitle={subtitle}
                />
              </Card>
            </TouchableOpacity>
          );
        })}
      </Collapsible>
    </>
  );
}

export default CommunityCard;