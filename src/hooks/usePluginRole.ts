import { useEffect, useEffectEvent, useState } from "react";

import { getPluginRole } from "@/api/portal";
import { PluginRole } from "@/utils/types";

export const usePluginRole = (pluginId: string) => {
  const [state, setState] = useState<Partial<PluginRole>>({});

  const fetchRole = useEffectEvent(async () => {
    setState({});

    if (!pluginId) return;

    const { canEdit, role } = await getPluginRole(pluginId);

    setState({ canEdit, role });
  });

  useEffect(() => {
    fetchRole();
  }, [pluginId]);

  return state;
};
