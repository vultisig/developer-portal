import { useTheme } from "styled-components";

import { useCore } from "@/hooks/useCore";
import { MailIcon } from "@/icons/MailIcon";
import { Button } from "@/toolkits/Button";
import { HStack, Stack, VStack } from "@/toolkits/Stack";

export const NewPluginPage = () => {
  const { vault } = useCore();
  const colors = useTheme();

  if (!vault) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "16px",
        }}
      >
        <Stack
          $style={{
            fontSize: "18px",
            color: colors.textTertiary.toHex(),
          }}
        >
          Please connect your Vultisig wallet to register a new plugin
        </Stack>
      </VStack>
    );
  }

  return (
    <VStack $style={{ gap: "32px", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <VStack $style={{ gap: "4px", textAlign: "center" }}>
        <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
          Register a New Plugin
        </Stack>
        <Stack $style={{ color: colors.textTertiary.toHex() }}>
          Interested in building on the Vultisig platform?
        </Stack>
      </VStack>

      {/* Contact Card */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "16px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "40px",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Stack
          $style={{
            backgroundColor: colors.accentThree.toHex(),
            borderRadius: "50%",
            padding: "20px",
          }}
        >
          <MailIcon fontSize={40} color={colors.neutral50.toHex()} />
        </Stack>

        <VStack $style={{ gap: "12px", textAlign: "center" }}>
          <Stack $style={{ fontSize: "20px", fontWeight: "600" }}>
            Contact the Vultisig Team
          </Stack>
          <Stack
            $style={{
              color: colors.textTertiary.toHex(),
              lineHeight: "1.6",
              maxWidth: "400px",
            }}
          >
            Plugin registration is currently handled by our team. Reach out to discuss
            your plugin idea, integration requirements, and get started with development.
          </Stack>
        </VStack>

        <VStack $style={{ gap: "16px", width: "100%" }}>
          <Button
            kind="primary"
            onClick={() => window.open("mailto:dev@vultisig.com", "_blank")}
            icon={<MailIcon />}
          >
            Email Us: dev@vultisig.com
          </Button>

          <HStack $style={{ gap: "12px", justifyContent: "center" }}>
            <Button
              kind="secondary"
              onClick={() => window.open("https://discord.gg/vultisig", "_blank")}
            >
              Join Discord
            </Button>
            <Button
              kind="secondary"
              onClick={() => window.open("https://docs.vultisig.com/plugins", "_blank")}
            >
              Read Docs
            </Button>
          </HStack>
        </VStack>
      </VStack>

      {/* Info Section */}
      <VStack
        $style={{
          backgroundColor: colors.bgTertiary.toHex(),
          borderRadius: "12px",
          padding: "24px",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          What We Need From You
        </Stack>

        <VStack as="ul" $style={{ gap: "12px", paddingLeft: "20px" }}>
          <Stack as="li" $style={{ color: colors.textSecondary.toHex() }}>
            <strong>Plugin Description:</strong> What does your plugin do and who is it for?
          </Stack>
          <Stack as="li" $style={{ color: colors.textSecondary.toHex() }}>
            <strong>Server Endpoint:</strong> The URL where your plugin server is hosted
          </Stack>
          <Stack as="li" $style={{ color: colors.textSecondary.toHex() }}>
            <strong>Pricing Model:</strong> How you want to charge users (per-transaction, subscription, etc.)
          </Stack>
          <Stack as="li" $style={{ color: colors.textSecondary.toHex() }}>
            <strong>Technical Specs:</strong> API documentation and integration requirements
          </Stack>
        </VStack>
      </VStack>

      {/* Benefits Section */}
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Why Build on Vultisig?
        </Stack>

        <HStack $style={{ gap: "24px", flexWrap: "wrap" }}>
          <VStack $style={{ gap: "4px", flex: "1", minWidth: "200px" }}>
            <Stack $style={{ fontWeight: "500" }}>Secure Multi-Sig</Stack>
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Built on threshold signatures for maximum security
            </Stack>
          </VStack>

          <VStack $style={{ gap: "4px", flex: "1", minWidth: "200px" }}>
            <Stack $style={{ fontWeight: "500" }}>Easy Monetization</Stack>
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Built-in fee collection and payment infrastructure
            </Stack>
          </VStack>

          <VStack $style={{ gap: "4px", flex: "1", minWidth: "200px" }}>
            <Stack $style={{ fontWeight: "500" }}>Growing Ecosystem</Stack>
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Access to Vultisig's user base and marketplace
            </Stack>
          </VStack>

          <VStack $style={{ gap: "4px", flex: "1", minWidth: "200px" }}>
            <Stack $style={{ fontWeight: "500" }}>Developer Support</Stack>
            <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
              Dedicated support and documentation
            </Stack>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
