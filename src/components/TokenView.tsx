import { FC, useEffect, useEffectEvent, useState } from "react";

import { TokenImage } from "@/components/TokenImage";
import { useQueries } from "@/hooks/useQueries";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack } from "@/toolkits/Stack";
import { Chain, nativeTokens } from "@/utils/chain";
import { Token } from "@/utils/types";

export const TokenView: FC<{ chain: Chain; id: string }> = ({ chain, id }) => {
  const [token, setToken] = useState<Token | undefined>(undefined);
  const { getTokenData } = useQueries();

  const handleTokenData = useEffectEvent((chain: Chain, tokenId: string) => {
    if (tokenId) {
      getTokenData(chain, tokenId)
        .catch(() => undefined)
        .then(setToken);
    } else {
      setToken(nativeTokens[chain]);
    }
  });

  useEffect(() => {
    handleTokenData(chain, id);
  }, [chain, id]);

  if (!token) return <Spin size="small" />;

  return (
    <HStack $style={{ alignItems: "center", gap: "8px" }}>
      <Stack $style={{ position: "relative" }}>
        <TokenImage
          alt={token.ticker}
          borderRadius="50%"
          height="34px"
          src={token.logo}
          width="34px"
        />
        {(!!id || chain !== token.chain) && (
          <Stack
            $style={{ bottom: "-2px", position: "absolute", right: "-2px" }}
          >
            <TokenImage
              alt={chain}
              borderRadius="50%"
              height="16px"
              src={`/tokens/${chain.toLowerCase()}.svg`}
              width="16px"
            />
          </Stack>
        )}
      </Stack>
      <Stack as="span" $style={{ lineHeight: "20px" }}>
        {token.ticker}
      </Stack>
    </HStack>
  );
};
