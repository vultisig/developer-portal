import { useEffect, useEffectEvent, useState } from "react";

import { getPluginRole } from "@/api/portal";
import { PluginRole } from "@/utils/types";

export const usePluginRole = (pluginId: string) => {
  const [state, setState] = useState<Partial<PluginRole>>({});

  const fetchRole = useEffectEvent(async (requestedPluginId: string) => {
    setState({});

    if (!requestedPluginId) return;

    const { canEdit, role } = await getPluginRole(requestedPluginId);
    
    if (requestedPluginId !== pluginId) return;

    setState({ canEdit, role });
  });

  useEffect(() => {
    fetchRole(pluginId);
  }, [pluginId]);

  return state;
};
