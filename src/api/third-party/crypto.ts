import { thirdPartyClient } from "@/api/third-party/client";
import { vultiApiUrl } from "@/utils/constants";
import { Currency } from "@/utils/currency";

export const getBaseValue = async (currency: Currency): Promise<number> => {
  if (currency === "usd") return 1;

  const modifiedCurrency = currency.toUpperCase();

  try {
    const { data } = await thirdPartyClient.get<{
      data: {
        [id: string]: { quote: { [currency: string]: { price: number } } };
      };
    }>(
      `${vultiApiUrl}/cmc/v2/cryptocurrency/quotes/latest?id=825&skip_invalid=true&aux=is_active&convert=${currency}`,
    );

    const quote = data?.[825]?.quote?.[modifiedCurrency];

    return quote?.price ?? 0;
  } catch {
    return 0;
  }
};
