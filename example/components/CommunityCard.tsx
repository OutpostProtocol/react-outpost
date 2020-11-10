import React, { useState } from "react";
import { Button, Card } from "react-native-paper";
import { Community } from "outpost-sdk/build/main/lib/requests/getPosts";
import Collapsible from "react-native-collapsible";
import { useTokenBalance } from "react-use-etherscan";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useTxIdToUri, usePosts, useOutpost } from "react-outpost";

import { useCurrentAddress } from "../hooks";
import PostModal from "./PostModal";

export type CommunityCardProps = {
  readonly community: Community;
  readonly authToken: string | null;
};

function CommunityCard({ community, authToken, ...extraProps }) {
  const [postModalState, setPostModalState] = useState({
    visible: false,
    post: null,
  });
  const { getPost } = useOutpost();
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
        {posts.map(({ title, subtitle, readRequirement, txId, ...extras }, i) => {
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
              onPress={async () => {
                const { post } = await getPost({ txId, authToken });
                setPostModalState({ post, visible: true });
              }}
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
      <PostModal {...postModalState} onRequestDismiss={() => setPostModalState(e => ({ ...e, visible: false }))}/>
    </>
  );
}

export default CommunityCard;
