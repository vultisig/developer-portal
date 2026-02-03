import { DatePicker, Input, message, Modal, Switch } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import {
  createPluginApiKey,
  createTeamInvite,
  deletePluginApiKey,
  getKillSwitch,
  getMyPluginRole,
  getPlugin,
  getPluginApiKeys,
  getPluginPricings,
  getTeamMembers,
  KillSwitchStatus,
  removeTeamMember,
  setKillSwitch,
  updatePlugin,
  updatePluginApiKeyStatus,
} from "@/api/plugins";
import { useCore } from "@/hooks/useCore";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import {
  computeFieldUpdates,
  createPluginUpdateTypedData,
  FieldUpdate,
  generateNonce,
  PluginUpdateMessage,
} from "@/utils/eip712";
import { signTypedData } from "@/utils/extension";
import { formatCurrency, formatDate } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, PluginApiKey, PluginPricing, TeamMember, TeamMemberRole } from "@/utils/types";

const { TextArea } = Input;

export const PluginEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { address, vault } = useCore();
  const navigate = useNavigate();
  const colors = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [pricings, setPricings] = useState<PluginPricing[]>([]);
  const [apiKeys, setApiKeys] = useState<PluginApiKey[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serverEndpoint, setServerEndpoint] = useState("");

  // Signing modal state
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<FieldUpdate[]>([]);

  // API Key management state
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [newKeyExpiry, setNewKeyExpiry] = useState<dayjs.Dayjs | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [updatingKeyId, setUpdatingKeyId] = useState<string | null>(null);
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  // User role state
  const [userRole, setUserRole] = useState<TeamMemberRole | null>(null);
  const [canEdit, setCanEdit] = useState(true);

  // Team management state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState<TeamMemberRole>("viewer");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  // Kill switch state (staff only)
  const [killSwitch, setKillSwitchState] = useState<KillSwitchStatus | null>(null);
  const [updatingKillSwitch, setUpdatingKillSwitch] = useState(false);

  useEffect(() => {
    const fetchPlugin = async () => {
      if (!id) return;

      try {
        // Fetch plugin and pricings (public endpoints)
        const [pluginData, pricingData] = await Promise.all([
          getPlugin(id),
          getPluginPricings(id),
        ]);

        if (pluginData) {
          setPlugin(pluginData);
          setTitle(pluginData.title);
          setDescription(pluginData.description);
          setServerEndpoint(pluginData.serverEndpoint);
        }
        setPricings(pricingData);

        // Fetch user's role for this plugin
        let fetchedRole: TeamMemberRole | null = null;
        try {
          const roleData = await getMyPluginRole(id);
          setUserRole(roleData.role);
          setCanEdit(roleData.canEdit);
          fetchedRole = roleData.role;
          setIsStaff(roleData.role === "staff");
        } catch (roleError) {
          console.warn("Could not fetch user role:", roleError);
          setUserRole(null);
          setCanEdit(false);
          setIsStaff(false);
        }

        // Fetch API keys (requires ownership - may fail with 403)
        try {
          const apiKeyData = await getPluginApiKeys(id);
          setApiKeys(apiKeyData);
        } catch (apiKeyError) {
          // User may not be authorized to view API keys
          console.warn("Could not fetch API keys:", apiKeyError);
          setApiKeys([]);
        }

        // Fetch team members (admin only - may fail with 403)
        try {
          const teamData = await getTeamMembers(id);
          setTeamMembers(teamData);
          // Check if current user is an admin
          const currentUserMember = teamData.find(m => m.isCurrentUser);
          setIsAdmin(currentUserMember?.role === "admin");
        } catch (teamError) {
          // User may not be authorized to view team members
          console.warn("Could not fetch team members:", teamError);
          setTeamMembers([]);
          setIsAdmin(false);
        }

        // Fetch kill switch status (staff or admin)
        if (fetchedRole === "staff" || fetchedRole === "admin") {
          try {
            const killSwitchData = await getKillSwitch(id);
            setKillSwitchState(killSwitchData);
          } catch (killSwitchError) {
            console.warn("Could not fetch kill switch:", killSwitchError);
            setKillSwitchState(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch plugin:", error);
        message.error("Failed to load plugin");
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [id]);

  const handleSaveClick = () => {
    if (!id || !plugin) return;

    // Compute field updates by comparing original and current values
    const original: Record<string, string> = {
      title: plugin.title,
      description: plugin.description,
      serverEndpoint: plugin.serverEndpoint,
    };

    const updated: Record<string, string> = {
      title,
      description,
      serverEndpoint,
    };

    const updates = computeFieldUpdates(original, updated);

    if (updates.length === 0) {
      message.info("No changes to save");
      return;
    }

    // Show signing modal with pending updates
    setPendingUpdates(updates);
    setShowSigningModal(true);
  };

  const handleSignAndSave = async () => {
    if (!id || !address) return;

    setSigning(true);
    try {
      // Create EIP-712 typed data message
      const updateMessage: PluginUpdateMessage = {
        pluginId: id,
        signer: address,
        nonce: generateNonce(),
        timestamp: Math.floor(Date.now() / 1000),
        updates: pendingUpdates,
      };

      const typedData = createPluginUpdateTypedData(updateMessage);

      // Request EIP-712 signature from wallet
      const signature = await signTypedData(address, typedData);

      if (!signature) {
        throw new Error("Signature was not provided");
      }

      // Save the plugin with the signature
      setSaving(true);
      await updatePlugin(id, {
        title,
        description,
        serverEndpoint,
        signature,
        signedMessage: updateMessage,
      });

      setShowSigningModal(false);
      message.success("Plugin updated successfully");
      navigate(routeTree.plugins.path);
    } catch (error) {
      console.error("Failed to sign or update plugin:", error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Failed to sign or update plugin");
      }
    } finally {
      setSigning(false);
      setSaving(false);
    }
  };

  // API Key handlers
  const handleCreateApiKey = async () => {
    if (!id) return;

    setCreatingKey(true);
    try {
      const response = await createPluginApiKey(id, {
        expiresAt: newKeyExpiry ? newKeyExpiry.toISOString() : undefined,
      });

      // Store the full key to show in the modal
      setNewlyCreatedKey(response.apikey);
      setShowCreateKeyModal(false);
      setShowNewKeyModal(true);
      setNewKeyExpiry(null);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success("API key created successfully");
    } catch (error) {
      console.error("Failed to create API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleToggleKeyStatus = async (keyId: string, currentStatus: number) => {
    if (!id) return;

    setUpdatingKeyId(keyId);
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await updatePluginApiKeyStatus(id, keyId, newStatus);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success(`API key ${newStatus === 1 ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to update API key");
    } finally {
      setUpdatingKeyId(null);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!id) return;

    setDeletingKeyId(keyId);
    try {
      await deletePluginApiKey(id, keyId);

      // Refresh the API keys list
      const apiKeyData = await getPluginApiKeys(id);
      setApiKeys(apiKeyData);

      message.success("API key deleted");
    } catch (error) {
      console.error("Failed to delete API key:", error);
      message.error(error instanceof Error ? error.message : "Failed to delete API key");
    } finally {
      setDeletingKeyId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  // Team management handlers
  const handleCreateInvite = async () => {
    if (!id) return;

    setCreatingInvite(true);
    try {
      const response = await createTeamInvite(id, { role: inviteRole });
      // Ensure the link has the full hostname
      let fullLink = response.link;
      if (!fullLink.startsWith("http")) {
        fullLink = `${window.location.origin}${fullLink.startsWith("/") ? "" : "/"}${fullLink}`;
      }
      setInviteLink(fullLink);
      setShowInviteModal(false);
      setShowInviteLinkModal(true);
      message.success("Invite link created successfully");
    } catch (error) {
      console.error("Failed to create invite:", error);
      message.error(error instanceof Error ? error.message : "Failed to create invite");
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleRemoveTeamMember = async (publicKey: string) => {
    if (!id) return;

    setRemovingMember(publicKey);
    try {
      await removeTeamMember(id, publicKey);
      // Refresh team members
      const teamData = await getTeamMembers(id);
      setTeamMembers(teamData);
      message.success("Team member removed");
    } catch (error) {
      console.error("Failed to remove team member:", error);
      message.error(error instanceof Error ? error.message : "Failed to remove team member");
    } finally {
      setRemovingMember(null);
    }
  };

  // Kill switch handler (staff only)
  const handleToggleKillSwitch = async (type: "keygen" | "keysign", enabled: boolean) => {
    if (!id) return;

    setUpdatingKillSwitch(true);
    try {
      const request = type === "keygen"
        ? { keygenEnabled: enabled }
        : { keysignEnabled: enabled };
      const result = await setKillSwitch(id, request);
      setKillSwitchState(result);
      message.success(`${type === "keygen" ? "Keygen" : "Keysign"} ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Failed to update kill switch:", error);
      message.error(error instanceof Error ? error.message : "Failed to update kill switch");
    } finally {
      setUpdatingKillSwitch(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return colors.buttonPrimary.toHex();
      case "staff":
        return colors.warning.toHex();
      case "editor":
        return colors.info.toHex();
      case "viewer":
        return colors.success.toHex();
      default:
        return colors.textTertiary.toHex();
    }
  };

  // Check if a key is expired
  const isKeyExpired = (expiresAt?: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

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
          Please connect your Vultisig wallet to edit plugins
        </Stack>
      </VStack>
    );
  }

  if (loading) {
    return <Spin centered />;
  }

  if (!plugin) {
    return (
      <VStack
        $style={{
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          gap: "16px",
        }}
      >
        <Stack $style={{ fontSize: "18px", color: colors.textTertiary.toHex() }}>
          Plugin not found
        </Stack>
        <Button onClick={() => navigate(routeTree.plugins.path)}>
          Back to Plugins
        </Button>
      </VStack>
    );
  }

  return (
    <VStack $style={{ gap: "32px", maxWidth: "800px" }}>
      {/* Header */}
      <HStack $style={{ alignItems: "center", justifyContent: "space-between" }}>
        <VStack $style={{ gap: "4px" }}>
          <HStack $style={{ gap: "12px", alignItems: "center" }}>
            <Stack $style={{ fontSize: "24px", fontWeight: "600" }}>
              {isStaff ? "Manage Plugin" : "Edit Plugin"}
            </Stack>
            {userRole && (
              <Stack
                $style={{
                  backgroundColor: getRoleBadgeColor(userRole),
                  color: colors.neutral50.toHex(),
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                }}
              >
                {userRole}
              </Stack>
            )}
          </HStack>
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            ID: {plugin.id}
          </Stack>
        </VStack>
        <HStack $style={{ gap: "12px" }}>
          <Button kind="secondary" onClick={() => navigate(routeTree.plugins.path)}>
            {isStaff ? "Back" : "Cancel"}
          </Button>
          {!isStaff && (
            <Button
              onClick={handleSaveClick}
              loading={saving}
              disabled={!canEdit}
            >
              Save Changes
            </Button>
          )}
        </HStack>
      </HStack>

      {/* Role restriction notice */}
      {userRole === "viewer" && (
        <Stack
          $style={{
            backgroundColor: colors.bgAlert.toHex(),
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          You have <strong>viewer</strong> access to this plugin. You can view settings but cannot make changes.
        </Stack>
      )}
      {userRole === "editor" && (
        <Stack
          $style={{
            backgroundColor: colors.bgAlert.toHex(),
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          You have <strong>editor</strong> access. You can edit title and description, but not the server endpoint.
        </Stack>
      )}
      {userRole === "staff" && (
        <Stack
          $style={{
            backgroundColor: colors.warning.toHex(),
            color: colors.neutral900.toHex(),
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          You have <strong>staff</strong> access. You can only manage the kill switch for this plugin.
        </Stack>
      )}

      {/* Basic Information (hidden from staff) */}
      {!isStaff && (
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "20px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Basic Information
        </Stack>

        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
            Title
          </Stack>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plugin title"
            disabled={!canEdit}
          />
        </VStack>

        <VStack $style={{ gap: "8px" }}>
          <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
            Description
          </Stack>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Plugin description"
            rows={4}
            disabled={!canEdit}
          />
        </VStack>

        <VStack $style={{ gap: "8px" }}>
          <HStack $style={{ gap: "8px", alignItems: "center" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Server Endpoint
            </Stack>
            {userRole === "editor" && (
              <Stack $style={{ fontSize: "11px", color: colors.textTertiary.toHex() }}>
                (Admin only)
              </Stack>
            )}
          </HStack>
          <Input
            value={serverEndpoint}
            onChange={(e) => setServerEndpoint(e.target.value)}
            placeholder="https://your-server.com"
            disabled={!canEdit || userRole === "editor"}
          />
        </VStack>
      </VStack>
      )}

      {/* Pricing Information (hidden from staff) */}
      {!isStaff && (
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
          Pricing Configuration
        </Stack>

        {pricings.length > 0 ? (
          <VStack $style={{ gap: "12px" }}>
            {pricings.map((pricing) => (
              <HStack
                key={pricing.id}
                $style={{
                  backgroundColor: colors.bgTertiary.toHex(),
                  borderRadius: "8px",
                  padding: "12px 16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <VStack $style={{ gap: "4px" }}>
                  <Stack $style={{ fontWeight: "500" }}>
                    {pricing.type.charAt(0).toUpperCase() + pricing.type.slice(1).replace("-", " ")}
                    {pricing.frequency && ` (${pricing.frequency})`}
                  </Stack>
                  <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                    {pricing.asset.toUpperCase()} - {pricing.metric}
                  </Stack>
                </VStack>
                <Stack $style={{ fontSize: "18px", fontWeight: "600" }}>
                  {formatCurrency(pricing.amount)}
                </Stack>
              </HStack>
            ))}
          </VStack>
        ) : (
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            No pricing configured - this plugin is free
          </Stack>
        )}
      </VStack>
      )}

      {/* API Keys (Admin only) */}
      {isAdmin && (
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "16px",
        }}
      >
        <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
            API Keys
          </Stack>
          <Button
            kind="secondary"
            onClick={() => setShowCreateKeyModal(true)}
          >
            Create New Key
          </Button>
        </HStack>

        {apiKeys.length > 0 ? (
          <VStack $style={{ gap: "12px" }}>
            {apiKeys.map((apiKey) => {
              const expired = isKeyExpired(apiKey.expiresAt);
              const isUpdating = updatingKeyId === apiKey.id;
              const isDeleting = deletingKeyId === apiKey.id;

              return (
                <HStack
                  key={apiKey.id}
                  $style={{
                    backgroundColor: colors.bgTertiary.toHex(),
                    borderRadius: "8px",
                    padding: "12px 16px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: expired ? 0.6 : 1,
                  }}
                >
                  <VStack $style={{ gap: "4px", flex: 1 }}>
                    <Stack
                      $style={{
                        fontFamily: "monospace",
                        fontSize: "13px",
                        backgroundColor: colors.bgPrimary.toHex(),
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        width: "fit-content",
                      }}
                    >
                      {apiKey.apikey}
                    </Stack>
                    <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                      Created: {formatDate(apiKey.createdAt)}
                      {apiKey.expiresAt && (
                        <span style={{ color: expired ? colors.error.toHex() : undefined }}>
                          {" | "}
                          {expired ? "Expired: " : "Expires: "}
                          {formatDate(apiKey.expiresAt)}
                        </span>
                      )}
                    </Stack>
                  </VStack>

                  <HStack $style={{ gap: "12px", alignItems: "center" }}>
                    {/* Status Toggle */}
                    <HStack $style={{ gap: "8px", alignItems: "center" }}>
                      <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                        {apiKey.status === 1 ? "Enabled" : "Disabled"}
                      </Stack>
                      <Switch
                        checked={apiKey.status === 1}
                        onChange={() => handleToggleKeyStatus(apiKey.id, apiKey.status)}
                        loading={isUpdating}
                        disabled={expired || isDeleting}
                        size="small"
                      />
                    </HStack>

                    {/* Status Badge */}
                    <Stack
                      $style={{
                        backgroundColor: expired
                          ? colors.textTertiary.toHex()
                          : apiKey.status === 1
                          ? colors.success.toHex()
                          : colors.error.toHex(),
                        color: colors.neutral50.toHex(),
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        minWidth: "70px",
                        textAlign: "center",
                      }}
                    >
                      {expired ? "Expired" : apiKey.status === 1 ? "Active" : "Inactive"}
                    </Stack>

                    {/* Delete Button */}
                    <Button
                      kind="secondary"
                      onClick={() => {
                        Modal.confirm({
                          title: "Delete API Key?",
                          content: "This will immediately expire the API key. This action cannot be undone.",
                          okText: "Delete",
                          okType: "danger",
                          cancelText: "Cancel",
                          onOk: () => handleDeleteApiKey(apiKey.id),
                        });
                      }}
                      loading={isDeleting}
                      disabled={expired}
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              );
            })}
          </VStack>
        ) : (
          <Stack $style={{ color: colors.textTertiary.toHex() }}>
            No API keys configured
          </Stack>
        )}
      </VStack>
      )}

      {/* Team Management (Admin only) */}
      {isAdmin && (
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRadius: "12px",
            border: `1px solid ${colors.borderLight.toHex()}`,
            padding: "24px",
            gap: "16px",
          }}
        >
          <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
              Team Members
            </Stack>
            <Button
              kind="secondary"
              onClick={() => setShowInviteModal(true)}
            >
              Invite Member
            </Button>
          </HStack>

          {teamMembers.length > 0 ? (
            <VStack $style={{ gap: "12px" }}>
              {teamMembers.map((member) => {
                const isRemoving = removingMember === member.publicKey;
                const canRemove = !member.isCurrentUser && member.role !== "admin";

                return (
                  <HStack
                    key={member.publicKey}
                    $style={{
                      backgroundColor: colors.bgTertiary.toHex(),
                      borderRadius: "8px",
                      padding: "12px 16px",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <VStack $style={{ gap: "4px", flex: 1 }}>
                      <HStack $style={{ gap: "8px", alignItems: "center" }}>
                        <Stack
                          $style={{
                            fontFamily: "monospace",
                            fontSize: "13px",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {member.publicKey}
                        </Stack>
                        {member.isCurrentUser && (
                          <Stack
                            $style={{
                              backgroundColor: colors.bgAlert.toHex(),
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "10px",
                            }}
                          >
                            You
                          </Stack>
                        )}
                      </HStack>
                      <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                        Added via {member.addedVia.replace(/_/g, " ")}
                        {member.addedBy && ` by ${member.addedBy.slice(0, 10)}...`}
                      </Stack>
                    </VStack>

                    <HStack $style={{ gap: "12px", alignItems: "center" }}>
                      <Stack
                        $style={{
                          backgroundColor: getRoleBadgeColor(member.role),
                          color: colors.neutral50.toHex(),
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        {member.role}
                      </Stack>

                      {canRemove && (
                        <Button
                          kind="secondary"
                          onClick={() => {
                            Modal.confirm({
                              title: "Remove Team Member?",
                              content: "This member will lose access to this plugin immediately.",
                              okText: "Remove",
                              okType: "danger",
                              cancelText: "Cancel",
                              onOk: () => handleRemoveTeamMember(member.publicKey),
                            });
                          }}
                          loading={isRemoving}
                        >
                          Remove
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                );
              })}
            </VStack>
          ) : (
            <Stack $style={{ color: colors.textTertiary.toHex() }}>
              No team members yet
            </Stack>
          )}
        </VStack>
      )}

      {/* Metadata (hidden from staff) */}
      {!isStaff && (
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight.toHex()}`,
          padding: "24px",
          gap: "12px",
        }}
      >
        <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
          Metadata
        </Stack>
        <HStack $style={{ gap: "32px", flexWrap: "wrap" }}>
          <VStack $style={{ gap: "4px" }}>
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Created
            </Stack>
            <Stack>{formatDate(plugin.createdAt)}</Stack>
          </VStack>
          <VStack $style={{ gap: "4px" }}>
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Last Updated
            </Stack>
            <Stack>{formatDate(plugin.updatedAt)}</Stack>
          </VStack>
          {plugin.publicKey && (
            <VStack $style={{ gap: "4px" }}>
              <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                Public Key
              </Stack>
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {plugin.publicKey}
              </Stack>
            </VStack>
          )}
          {killSwitch && (
            <>
              <VStack $style={{ gap: "4px" }}>
                <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                  Keygen
                </Stack>
                <Stack
                  $style={{
                    color: killSwitch.keygenEnabled ? colors.success.toHex() : colors.error.toHex(),
                    fontWeight: "500",
                  }}
                >
                  {killSwitch.keygenEnabled ? "Enabled" : "Disabled"}
                </Stack>
              </VStack>
              <VStack $style={{ gap: "4px" }}>
                <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                  Keysign
                </Stack>
                <Stack
                  $style={{
                    color: killSwitch.keysignEnabled ? colors.success.toHex() : colors.error.toHex(),
                    fontWeight: "500",
                  }}
                >
                  {killSwitch.keysignEnabled ? "Enabled" : "Disabled"}
                </Stack>
              </VStack>
            </>
          )}
        </HStack>
      </VStack>
      )}

      {/* Kill Switch (Staff or Admin) */}
      {(isStaff || isAdmin) && (
        <VStack
          $style={{
            backgroundColor: colors.bgSecondary.toHex(),
            borderRadius: "12px",
            border: `1px solid ${colors.warning.toHex()}`,
            padding: "24px",
            gap: "16px",
          }}
        >
          <HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
            <VStack $style={{ gap: "4px" }}>
              <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
                Kill Switch
              </Stack>
              <Stack $style={{ fontSize: "13px", color: colors.textTertiary.toHex() }}>
                Emergency controls to disable plugin operations
              </Stack>
            </VStack>
          </HStack>

          {killSwitch ? (
          <VStack $style={{ gap: "12px" }}>
            <HStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "8px",
                padding: "16px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <VStack $style={{ gap: "4px" }}>
                <Stack $style={{ fontWeight: "500" }}>Keygen</Stack>
                <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                  Allow new key generation for this plugin
                </Stack>
              </VStack>
              <HStack $style={{ gap: "12px", alignItems: "center" }}>
                <Stack
                  $style={{
                    fontSize: "12px",
                    color: killSwitch.keygenEnabled ? colors.success.toHex() : colors.error.toHex(),
                  }}
                >
                  {killSwitch.keygenEnabled ? "Enabled" : "Disabled"}
                </Stack>
                <Switch
                  checked={killSwitch.keygenEnabled}
                  onChange={(checked) => handleToggleKillSwitch("keygen", checked)}
                  loading={updatingKillSwitch}
                />
              </HStack>
            </HStack>

            <HStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "8px",
                padding: "16px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <VStack $style={{ gap: "4px" }}>
                <Stack $style={{ fontWeight: "500" }}>Keysign</Stack>
                <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
                  Allow transaction signing for this plugin
                </Stack>
              </VStack>
              <HStack $style={{ gap: "12px", alignItems: "center" }}>
                <Stack
                  $style={{
                    fontSize: "12px",
                    color: killSwitch.keysignEnabled ? colors.success.toHex() : colors.error.toHex(),
                  }}
                >
                  {killSwitch.keysignEnabled ? "Enabled" : "Disabled"}
                </Stack>
                <Switch
                  checked={killSwitch.keysignEnabled}
                  onChange={(checked) => handleToggleKillSwitch("keysign", checked)}
                  loading={updatingKillSwitch}
                />
              </HStack>
            </HStack>
          </VStack>
          ) : (
            <Stack $style={{ color: colors.textTertiary.toHex(), fontSize: "13px" }}>
              Loading kill switch status...
            </Stack>
          )}
        </VStack>
      )}

      {/* EIP-712 Signing Modal (hidden from staff) */}
      {!isStaff && (
      <Modal
        title="Sign Plugin Update"
        open={showSigningModal}
        onCancel={() => setShowSigningModal(false)}
        footer={[
          <Button
            key="cancel"
            kind="secondary"
            onClick={() => setShowSigningModal(false)}
            disabled={signing}
          >
            Cancel
          </Button>,
          <Button
            key="sign"
            onClick={handleSignAndSave}
            loading={signing}
          >
            Sign & Save
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "16px", padding: "16px 0" }}>
          <Stack $style={{ color: colors.textSecondary.toHex() }}>
            Please sign to confirm the following changes to plugin{" "}
            <strong>{plugin?.title || id}</strong>:
          </Stack>

          <VStack
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "8px",
              padding: "16px",
              gap: "12px",
            }}
          >
            {pendingUpdates.map((update, index) => (
              <VStack key={index} $style={{ gap: "4px" }}>
                <Stack
                  $style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: colors.textPrimary.toHex(),
                  }}
                >
                  {update.field}
                </Stack>
                <HStack $style={{ gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <Stack
                    $style={{
                      fontSize: "12px",
                      color: colors.error.toHex(),
                      textDecoration: "line-through",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.oldValue || "(empty)"}
                  </Stack>
                  <Stack $style={{ color: colors.textTertiary.toHex() }}>→</Stack>
                  <Stack
                    $style={{
                      fontSize: "12px",
                      color: colors.success.toHex(),
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {update.newValue || "(empty)"}
                  </Stack>
                </HStack>
              </VStack>
            ))}
          </VStack>

          <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
            This action requires an EIP-712 signature from your connected wallet to verify
            your authorization.
          </Stack>
        </VStack>
      </Modal>
      )}

      {/* Create API Key Modal */}
      <Modal
        title="Create New API Key"
        open={showCreateKeyModal}
        onCancel={() => {
          setShowCreateKeyModal(false);
          setNewKeyExpiry(null);
        }}
        footer={[
          <Button
            key="cancel"
            kind="secondary"
            onClick={() => {
              setShowCreateKeyModal(false);
              setNewKeyExpiry(null);
            }}
            disabled={creatingKey}
          >
            Cancel
          </Button>,
          <Button
            key="create"
            onClick={handleCreateApiKey}
            loading={creatingKey}
          >
            Create Key
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "20px", padding: "16px 0" }}>
          <Stack $style={{ color: colors.textSecondary.toHex() }}>
            Create a new API key for this plugin. The key will be shown only once after creation.
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Expiry Date (optional)
            </Stack>
            <DatePicker
              value={newKeyExpiry}
              onChange={(date) => setNewKeyExpiry(date)}
              placeholder="No expiry (never expires)"
              showTime
              disabledDate={(current) => current && current < dayjs().startOf("day")}
              style={{ width: "100%" }}
            />
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              Leave empty for a key that never expires. You can always delete it later.
            </Stack>
          </VStack>
        </VStack>
      </Modal>

      {/* Newly Created Key Modal */}
      <Modal
        title="API Key Created"
        open={showNewKeyModal}
        onCancel={() => {
          setShowNewKeyModal(false);
          setNewlyCreatedKey(null);
        }}
        footer={[
          <Button
            key="copy"
            onClick={() => {
              if (newlyCreatedKey) {
                copyToClipboard(newlyCreatedKey);
              }
            }}
          >
            Copy Key
          </Button>,
          <Button
            key="done"
            kind="secondary"
            onClick={() => {
              setShowNewKeyModal(false);
              setNewlyCreatedKey(null);
            }}
          >
            Done
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "16px", padding: "16px 0" }}>
          <Stack
            $style={{
              backgroundColor: colors.warning.toHex(),
              color: colors.neutral900.toHex(),
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <strong>Important:</strong> Copy this API key now. You won&apos;t be able to see it again!
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Your new API key:
            </Stack>
            <HStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "8px",
                padding: "12px 16px",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "14px",
                  flex: 1,
                  wordBreak: "break-all",
                }}
              >
                {newlyCreatedKey}
              </Stack>
              <Button
                kind="secondary"
                onClick={() => {
                  if (newlyCreatedKey) {
                    copyToClipboard(newlyCreatedKey);
                  }
                }}
              >
                Copy
              </Button>
            </HStack>
          </VStack>

          <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
            Use this key to authenticate API requests to your plugin. Include it in the
            Authorization header as: <code>Bearer {"{your-api-key}"}</code>
          </Stack>
        </VStack>
      </Modal>

      {/* Create Invite Modal */}
      <Modal
        title="Invite Team Member"
        open={showInviteModal}
        onCancel={() => {
          setShowInviteModal(false);
          setInviteRole("viewer");
        }}
        footer={[
          <Button
            key="cancel"
            kind="secondary"
            onClick={() => {
              setShowInviteModal(false);
              setInviteRole("viewer");
            }}
            disabled={creatingInvite}
          >
            Cancel
          </Button>,
          <Button
            key="create"
            onClick={handleCreateInvite}
            loading={creatingInvite}
          >
            Create Invite Link
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "20px", padding: "16px 0" }}>
          <Stack $style={{ color: colors.textSecondary.toHex() }}>
            Create an invite link to add a new team member. The link will expire in 8 hours and can only be used once.
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Role
            </Stack>
            <HStack $style={{ gap: "12px" }}>
              <Button
                kind={inviteRole === "editor" ? "primary" : "secondary"}
                onClick={() => setInviteRole("editor")}
              >
                Editor
              </Button>
              <Button
                kind={inviteRole === "viewer" ? "primary" : "secondary"}
                onClick={() => setInviteRole("viewer")}
              >
                Viewer
              </Button>
            </HStack>
            <Stack $style={{ fontSize: "12px", color: colors.textTertiary.toHex() }}>
              {inviteRole === "editor"
                ? "Editors can view and modify plugin settings."
                : "Viewers can only view plugin information and analytics."}
            </Stack>
          </VStack>
        </VStack>
      </Modal>

      {/* Invite Link Modal */}
      <Modal
        title="Invite Link Created"
        open={showInviteLinkModal}
        onCancel={() => {
          setShowInviteLinkModal(false);
          setInviteLink(null);
        }}
        footer={[
          <Button
            key="copy"
            onClick={() => {
              if (inviteLink) {
                copyToClipboard(inviteLink);
              }
            }}
          >
            Copy Link
          </Button>,
          <Button
            key="done"
            kind="secondary"
            onClick={() => {
              setShowInviteLinkModal(false);
              setInviteLink(null);
            }}
          >
            Done
          </Button>,
        ]}
      >
        <VStack $style={{ gap: "16px", padding: "16px 0" }}>
          <Stack
            $style={{
              backgroundColor: colors.warning.toHex(),
              color: colors.neutral900.toHex(),
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            <strong>Important:</strong> This link will expire in 8 hours and can only be used once.
          </Stack>

          <VStack $style={{ gap: "8px" }}>
            <Stack $style={{ fontSize: "13px", color: colors.textSecondary.toHex() }}>
              Share this link with the person you want to invite:
            </Stack>
            <HStack
              $style={{
                backgroundColor: colors.bgTertiary.toHex(),
                borderRadius: "8px",
                padding: "12px 16px",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Stack
                $style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  flex: 1,
                  wordBreak: "break-all",
                }}
              >
                {inviteLink}
              </Stack>
              <Button
                kind="secondary"
                onClick={() => {
                  if (inviteLink) {
                    copyToClipboard(inviteLink);
                  }
                }}
              >
                Copy
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Modal>
    </VStack>
  );
};
