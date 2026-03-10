import { FC } from "react";
import { useTheme } from "styled-components";

import { Stack, VStack } from "@/toolkits/Stack";
import { formatDateWithTimezone } from "@/utils/functions";

export const DateView: FC<{ date: string }> = ({ date }) => {
  const colors = useTheme();
  
  if (!date) return "-";

  const parsedDate = formatDateWithTimezone(date);

  return (
    <VStack $style={{ gap: "4px" }}>
      <Stack as="span" $style={{ lineHeight: "18px", whiteSpace: "nowrap" }}>
        {`${parsedDate.date} ${parsedDate.time}`}
      </Stack>
      <Stack
        as="span"
        $style={{
          color: colors.textTertiary.toHex(),
          fontSize: "12px",
          lineHeight: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {parsedDate.timezone}
      </Stack>
    </VStack>
  );
};
