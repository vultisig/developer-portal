import { jwtDecode } from "jwt-decode";

import { apiClient } from "@/api/client";
import { toSnakeCase } from "@/utils/functions";
import { AuthToken } from "@/utils/types";

export const delAuthToken = async (token: string): Promise<void> => {
  const { token_id } = jwtDecode<{ token_id: string }>(token);

  return apiClient.del(`/auth/tokens/${token_id}`);
};

export const getAuthToken = async (data: {
  chainCodeHex: string;
  message: string;
  publicKey: string;
  signature: string;
}): Promise<AuthToken> => {
  return apiClient.post<AuthToken>("/auth", toSnakeCase(data));
};
