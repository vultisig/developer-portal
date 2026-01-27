import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { acceptTeamInvite, validateInvite } from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { formatDate } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { InviteInfo } from "@/utils/types";

export const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const { address, vault, connect } = useCore();
  const navigate = useNavigate();
  const colors = useTheme();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [accepted, setAccepted] = useState(false);

  const data = searchParams.get("data");
  const sig = searchParams.get("sig");

  useEffect(() => {
    const validateInviteLink = async () => {
      if (!data || !sig) {
        setError("Invalid invite link - missing parameters");
        setLoading(false);
        return;
      }

      try {
        const info = await validateInvite(data, sig);
        setInviteInfo(info);
      } catch (err) {
        console.error("Failed to validate invite:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Invalid or expired invite link");
        }
      } finally {
        setLoading(false);
      }
    };

    validateInviteLink();
  }, [data, sig]);

  const handleAcceptInvite = async () => {
    if (!inviteInfo || !data || !sig) return;

    setAccepting(true);
    try {
      await acceptTeamInvite(inviteInfo.pluginId, {
        data,
        signature: sig,
      });

      setAccepted(true);
      message.success("Invite accepted successfully!");
    } catch (err) {
      console.error("Failed to accept invite:", err);
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Failed to accept invite");
      }
    } finally {
      setAccepting(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "editor":
        return "You will be able to view and edit plugin settings.";
      case "viewer":
        return "You will be able to view plugin information and analytics.";
      default:
        return "";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return colors.buttonPrimary.toHex();
      case "editor":
        return colors.info.toHex();
      case "viewer":
        return colors.success.toHex();
      default:
        return colors.textTertiary.toHex();
    }
  };

  if (loading) {
    return <Spin centered />;
  }

  if (error) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "24px",
          padding: "32px",
        }}
      >
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRadius: "16px",
            border: `1px solid ${colors.borderLight.toHex()}`,
            padding: "48px",
            maxWidth: "500px",
            width: "100%",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Stack
            $style={{
              fontSize: "48px",
            }}
          >
            :(
          </Stack>
          <VStack $style={{ gap: "8px", alignItems: "center" }}>
            <Stack $style={{ fontSize: "20px", fontWeight: "600" }}>
              Invalid Invite Link
            </Stack>
            <Stack
              $style={{
                color: colors.textTertiary.toHex(),
                textAlign: "center",
              }}
            >
              {error}
            </Stack>
          </VStack>
          <Button onClick={() => navigate(routeTree.plugins.path)}>
            Go to Plugins
          </Button>
        </VStack>
      </VStack>
    );
  }

  if (accepted) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "24px",
          padding: "32px",
        }}
      >
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRadius: "16px",
            border: `1px solid ${colors.borderLight.toHex()}`,
            padding: "48px",
            maxWidth: "500px",
            width: "100%",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Stack
            $style={{
              fontSize: "48px",
            }}
          >
            :)
          </Stack>
          <VStack $style={{ gap: "8px", alignItems: "center" }}>
            <Stack $style={{ fontSize: "20px", fontWeight: "600" }}>
              Welcome to the Team!
            </Stack>
            <Stack
              $style={{
                color: colors.textTertiary.toHex(),
                textAlign: "center",
              }}
            >
              You have successfully joined <strong>{inviteInfo?.pluginName}</strong> as a{" "}
              <strong>{inviteInfo?.role}</strong>.
            </Stack>
          </VStack>
          <Button onClick={() => navigate(routeTree.plugins.path)}>
            Go to Plugins
          </Button>
        </VStack>
      </VStack>
    );
  }

  if (!vault || !address) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "24px",
          padding: "32px",
        }}
      >
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRadius: "16px",
            border: `1px solid ${colors.borderLight.toHex()}`,
            padding: "48px",
            maxWidth: "500px",
            width: "100%",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
            Connect Your Wallet
          </Stack>
          <Stack
            $style={{
              color: colors.textTertiary.toHex(),
              textAlign: "center",
            }}
          >
            You need to connect your Vultisig wallet to accept this team invite.
          </Stack>

          {inviteInfo && (
            <VStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "12px",
                padding: "20px",
                width: "100%",
                gap: "12px",
              }}
            >
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Plugin
                </Stack>
                <Stack $style={{ fontWeight: "500" }}>{inviteInfo.pluginName}</Stack>
              </HStack>
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Role
                </Stack>
                <Stack
                  $style={{
                    backgroundColor: getRoleBadgeColor(inviteInfo.role),
                    color: colors.neutral50.toHex(),
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  {inviteInfo.role}
                </Stack>
              </HStack>
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Expires
                </Stack>
                <Stack $style={{ fontSize: "13px" }}>
                  {formatDate(inviteInfo.expiresAt)}
                </Stack>
              </HStack>
            </VStack>
          )}

          <Button onClick={connect}>Connect Wallet</Button>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack
      $style={{
        alignItems: "center",
        justifyContent: "center",
        flex: "1",
        gap: "24px",
        padding: "32px",
      }}
    >
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "16px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "48px",
          maxWidth: "500px",
          width: "100%",
          gap: "24px",
        }}
      >
        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
            Team Invite
          </Stack>
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            You have been invited to join a plugin team
          </Stack>
        </VStack>

        {inviteInfo && (
          <>
            <VStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "12px",
                padding: "20px",
                gap: "12px",
              }}
            >
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Plugin
                </Stack>
                <Stack $style={{ fontWeight: "500" }}>{inviteInfo.pluginName}</Stack>
              </HStack>
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Invited by
                </Stack>
                <Stack
                  $style={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    maxWidth: "180px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {inviteInfo.invitedBy}
                </Stack>
              </HStack>
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Role
                </Stack>
                <Stack
                  $style={{
                    backgroundColor: getRoleBadgeColor(inviteInfo.role),
                    color: colors.neutral50.toHex(),
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                  }}
                >
                  {inviteInfo.role}
                </Stack>
              </HStack>
              <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
                <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
                  Expires
                </Stack>
                <Stack $style={{ fontSize: "13px" }}>
                  {formatDate(inviteInfo.expiresAt)}
                </Stack>
              </HStack>
            </VStack>

            <Stack $style={{ color: colors.textSecondary.toHex(), fontSize: "14px" }}>
              {getRoleDescription(inviteInfo.role)}
            </Stack>

            <VStack
              $style={{
                backgroundColor: colors.bgAlert.toHex(),
                borderRadius: "8px",
                padding: "12px 16px",
                gap: "4px",
              }}
            >
              <Stack $style={{ fontSize: "13px", fontWeight: "500" }}>
                Your wallet address:
              </Stack>
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  wordBreak: "break-all",
                }}
              >
                {address}
              </Stack>
            </VStack>
          </>
        )}

        <HStack $style={{ gap: "12px", justifyContent: "flex-end" }}>
          <Button
            kind="secondary"
            onClick={() => navigate(routeTree.plugins.path)}
            disabled={accepting}
          >
            Decline
          </Button>
          <Button onClick={handleAcceptInvite} loading={accepting}>
            Accept Invite
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
