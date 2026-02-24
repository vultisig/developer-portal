import { Modal } from "antd";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "styled-components";

import { useCore } from "@/hooks/useCore";
import { useGoBack } from "@/hooks/useGoBack";
import { Divider } from "@/toolkits/Divider";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { modalHash } from "@/utils/constants";
import { currencies, Currency, currencySymbols } from "@/utils/currency";

export const CurrencyModal = () => {
  const { currency, setCurrency } = useCore();
  const { hash } = useLocation();
  const goBack = useGoBack();
  const colors = useTheme();

  const handleSelect = (key: Currency): void => {
    setCurrency(key);

    goBack();
  };

  return (
    <Modal
      centered={true}
      footer={false}
      mask={{ closable: false }}
      onCancel={() => goBack()}
      open={hash === modalHash.currency}
      styles={{ footer: { display: "none" } }}
      title="Change Currency"
      width={360}
    >
      <VStack $style={{ gap: "8px" }}>
        {currencies.map((key, ind) => (
          <Fragment key={key}>
            {ind > 0 && <Divider light />}
            <HStack
              key={key}
              onClick={() => handleSelect(key)}
              $style={{
                alignItems: "center",
                cursor: "pointer",
                justifyContent: "space-between",
                lineHeight: "32px",
                ...(key === currency
                  ? { color: colors.accentFour.toHex() }
                  : {}),
              }}
              $hover={{ color: colors.accentFour.toHex() }}
            >
              <Stack as="span">{currencySymbols[key]}</Stack>
              <Stack as="span">{key.toUpperCase()}</Stack>
            </HStack>
          </Fragment>
        ))}
      </VStack>
    </Modal>
  );
};
