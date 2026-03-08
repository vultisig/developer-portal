import { useEffect, useEffectEvent, useState } from "react";

import { getAdminProposals } from "@/api/portal";

export const useIsApprover = (): { isApprover: boolean; loading: boolean } => {
  const [state, setState] = useState({ isApprover: false, loading: true });

  const checkApprover = useEffectEvent(async () => {
    try {
      await getAdminProposals();

      setState({ isApprover: true, loading: false });
    } catch {
      setState({ isApprover: false, loading: false });
    }
  });

  useEffect(() => {
    checkApprover();
  }, []);

  return state;
};
