import { Form, FormProps, Input, message, theme as antTheme } from "antd";
import { useEffect, useEffectEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { getPlugin, updatePlugin } from "@/api/portal";
import { useAntd } from "@/hooks/useAntd";
import { useGoBack } from "@/hooks/useGoBack";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { createPluginUpdateTypedData } from "@/utils/eip712";
import { connect, signTypedData } from "@/utils/extension";
import { computeFieldUpdates, generateNonce } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Plugin, PluginUpdate, PluginUpdateMessage } from "@/utils/types";

type StateProps = {
  plugin?: Plugin;
  submitting?: boolean;
};

export const PluginUpdatePage = () => {
  const [state, setState] = useState<StateProps>({});
  const { plugin, submitting } = state;
  const { token } = antTheme.useToken();
  const { onFinishFailed } = useAntd();
  const { pluginId = "" } = useParams();
  const [form] = Form.useForm<PluginUpdate>();
  const goBack = useGoBack();
  const colors = useTheme();

  const fetchPlugin = useEffectEvent(async () => {
    try {
      const plugin = await getPlugin(pluginId);

      setState((prev) => ({ ...prev, plugin }));

      setTimeout(() => {
        form.setFieldsValue({
          description: plugin.description,
          payoutAddress: plugin.payoutAddress,
          serverEndpoint: plugin.serverEndpoint,
          title: plugin.title,
        });
      }, 0);
    } catch {
      message.error("Failed to load plugin");

      goBack(routeTree.plugins.path);
    }
  });

  const handleFinish: FormProps<PluginUpdate>["onFinish"] = async (values) => {
    if (submitting || !plugin) return;

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      const original: Record<string, string> = {
        title: plugin.title,
        description: plugin.description,
        serverEndpoint: plugin.serverEndpoint,
        payoutAddress: plugin.payoutAddress,
      };

      const updates = computeFieldUpdates(original, values);

      if (updates.length === 0) {
        message.info("No changes to save");
        setState((prev) => ({ ...prev, submitting: false }));
        return;
      }

      const address = await connect();

      const updateMessage: PluginUpdateMessage = {
        pluginId,
        signer: address,
        nonce: generateNonce(),
        timestamp: Math.floor(Date.now() / 1000),
        updates,
      };

      const typedData = createPluginUpdateTypedData(updateMessage);
      const signature = await signTypedData(address, typedData);

      if (!signature) throw new Error("Signature was not provided");

      await updatePlugin({
        data: values,
        pluginId,
        signature,
        signedMessage: updateMessage,
      });

      message.success("Plugin updated successfully!");
      goBack(routeTree.plugins.path);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An error occurred");
      }
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  };

  useEffect(() => {
    fetchPlugin();
  }, [pluginId]);

  if (!plugin) return <Spin centered />;

  return (
    <VStack
      $style={{
        gap: "16px",
        maxWidth: `${token.screenMD}px`,
        padding: "16px",
        width: "100%",
      }}
    >
      <VStack $style={{ gap: "2px" }}>
        <Stack
          as="span"
          $style={{
            fontSize: "22px",
            lineHeight: "24px",
            textAlign: "center",
          }}
        >
          {`Edit ${plugin.title}`}
        </Stack>
        <Stack
          as="span"
          $style={{
            color: colors.textTertiary.toHex(),
            fontSize: "13px",
            lineHeight: "18px",
            textAlign: "center",
          }}
        >
          Update your plugin settings
        </Stack>
      </VStack>
      <VStack
        $style={{
          backgroundColor: colors.bgSecondary.toHex(),
          borderRadius: "20px",
          gap: "20px",
          padding: "20px",
        }}
      >
        <VStack
          $style={{
            backgroundColor: colors.bgTertiary.toHex(),
            borderRadius: "20px",
            gap: "20px",
            padding: "20px",
          }}
        >
          <Stack as="span" $style={{ fontSize: "16px", fontWeight: "600" }}>
            Basic Information
          </Stack>
          <Form<PluginUpdate>
            autoComplete="off"
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onFinishFailed={(errorInfo) => onFinishFailed(errorInfo, form)}
            requiredMark={false}
          >
            <Form.Item<PluginUpdate>
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your plugin title!",
                },
              ]}
            >
              <Input placeholder="e.g., DCA Plugin" />
            </Form.Item>
            <Form.Item<PluginUpdate>
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your plugin description!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Describe what your plugin does"
                rows={4}
              />
            </Form.Item>
            <Form.Item<PluginUpdate>
              label="Server Endpoint"
              name="serverEndpoint"
              rules={[
                {
                  required: true,
                  message: "Please input your server endpoint!",
                },
              ]}
            >
              <Input placeholder="https://your-plugin.example.com" />
            </Form.Item>
            <Form.Item<PluginUpdate>
              label="Payout Address"
              name="payoutAddress"
              rules={[
                {
                  pattern: /^0x[0-9a-fA-F]{40}$/,
                  message: "Please enter a valid Ethereum address!",
                },
              ]}
            >
              <Input placeholder="0x..." />
            </Form.Item>
          </Form>
        </VStack>
        <HStack $style={{ justifyContent: "center", gap: "12px" }}>
          <Button
            kind="secondary"
            onClick={() => goBack(routeTree.plugins.path)}
          >
            Cancel
          </Button>
          <Button loading={submitting} onClick={() => form.submit()}>
            Save Changes
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
