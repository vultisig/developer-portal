import { useEffect, useEffectEvent, useState } from "react";

import { getAdminProposals } from "@/api/portal";

export const useIsApprover = () => {
  const [isApprover, setIsApprover] = useState<boolean | undefined>(undefined);

  const checkApprover = useEffectEvent(async () => {
    setIsApprover(undefined);

    try {
      await getAdminProposals();

      setIsApprover(true);
    } catch {
      setIsApprover(false);
    }
  });

  useEffect(() => {
    checkApprover();
  }, []);

  return isApprover;
};
