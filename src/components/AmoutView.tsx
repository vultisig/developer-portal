import { FC, useEffect, useEffectEvent, useState } from "react";
import { formatUnits } from "viem";

import { useQueries } from "@/hooks/useQueries";
import { Spin } from "@/toolkits/Spin";
import { Chain, nativeTokens } from "@/utils/chain";
import { toNumberFormat } from "@/utils/functions";
import { Token } from "@/utils/types";

export const AmoutView: FC<{
  amount: string;
  tokenId: string;
  chain: Chain;
}> = ({ amount, chain, tokenId }) => {
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
    handleTokenData(chain, tokenId);
  }, [chain, tokenId]);

  if (!token) return <Spin size="small" />;

  return toNumberFormat(
    formatUnits(BigInt(amount), token.decimals),
    token.decimals,
  );
};
