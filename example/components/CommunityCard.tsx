import React, { useState } from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { Community } from "outpost-sdk/build/main/lib/requests/getPosts";
import Collapsible from "react-native-collapsible";

import { useTxIdToUri, usePosts } from "../lib";

export type CommunityCardProps = {
  readonly community: Community;
};

function CommunityCard({ community, ...extraProps }) {
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
          // So we need some kind of abstract canRead.
          return (
            <Card key={i}>
              <Card.Title
                title={title}
                subtitle={subtitle}
              />
            </Card>
          );
        })}
      </Collapsible>
    </>
  );
}

export default CommunityCard;