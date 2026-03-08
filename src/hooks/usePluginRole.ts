import { useEffect, useEffectEvent, useState } from "react";

import { getMyRole } from "@/api/portal";
import { PluginRole } from "@/utils/types";

type UsePluginRoleResult = PluginRole & {
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
};

export const usePluginRole = (pluginId: string): UsePluginRoleResult => {
  const [state, setState] = useState<
    Partial<PluginRole> & { loading: boolean }
  >({ loading: true });

  const fetchRole = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const role = await getMyRole(pluginId);

      setState({ ...role, loading: false });
    } catch {
      setState({ role: "viewer", canEdit: false, loading: false });
    }
  });

  useEffect(() => {
    if (pluginId) fetchRole();
  }, [pluginId]);

  const role = state.role ?? "viewer";

  return {
    canEdit: state.canEdit ?? false,
    isAdmin: role === "admin",
    isStaff: role === "staff",
    loading: state.loading,
    role,
  };
};
