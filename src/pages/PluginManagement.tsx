import {
  Form,
  FormProps,
  Input,
  Select,
  theme as antTheme,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useResponsive } from "antd-style";
import { Fragment, useEffect, useEffectEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { CheckmarkIcon } from "@/icons/CheckmarkIcon";
import { EmailTwoIcon } from "@/icons/EmailTwoIcon";
import { ImagesFiveIcon } from "@/icons/ImagesFiveIcon";
import { Button } from "@/toolkits/Button";
import { Divider } from "@/toolkits/Divider";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { chains } from "@/utils/chain";
import { Plugin } from "@/utils/types";

type StateProps = {
  plugin?: Plugin;
  loaded?: boolean;
  step: number;
};

const steps = [
  "Plugin Basics",
  "Technical Details",
  "plugin-config.yaml",
  "Contact Info",
] as const;

export const PluginManagement = () => {
  const [state, setState] = useState<StateProps>({ step: 4 });
  const { loaded, step, plugin } = state;
  const { token } = antTheme.useToken();
  const { md } = useResponsive();
  const { pluginId = "" } = useParams();
  const [form] = Form.useForm<Plugin>();
  const colors = useTheme();

  const handleFinish: FormProps<Plugin>["onFinish"] = (values) => {
    console.log("Form values:", values);
  };

  const handlePluginChange = useEffectEvent((pluginId: string) => {
    if (pluginId) {
      setState((prev) => ({ ...prev, loaded: false }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, loaded: true }));
      }, 1000);
    } else {
      setState((prev) => ({ ...prev, loaded: true }));
    }
  });

  useEffect(() => {
    handlePluginChange(pluginId);
  }, [pluginId]);

  if (!loaded) return <Spin centered />;

  return (
    <>
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
            {!plugin ? "Register a New Plugin" : `Edit ${plugin.title} Plugin`}
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
            Fill out the details below. Your submission will be sent directly to
            the Vultisig team for review.
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
            $style={{ gap: "16px" }}
            $media={{
              md: {
                $style: {
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              },
            }}
          >
            {steps.map((item, index) => {
              const disabled = step < index + 1;
              const passed = step > index + 1;

              return (
                <Fragment key={index}>
                  <HStack $style={{ alignItems: "center", gap: "8px" }}>
                    <HStack
                      as="span"
                      $style={{
                        alignItems: "center",
                        backgroundColor: passed
                          ? colors.success.toHex()
                          : colors.bgTertiary.toHex(),
                        borderRadius: "50%",
                        color: passed
                          ? colors.neutral50.toHex()
                          : disabled
                            ? colors.textTertiary.toHex()
                            : colors.accentFour.toHex(),
                        height: "24px",
                        justifyContent: "center",
                        lineHeight: "24px",
                        width: "24px",
                        ...(disabled || passed
                          ? {}
                          : {
                              borderColor: colors.accentFour.toHex(),
                              borderStyle: "solid",
                              borderWidth: "1px",
                            }),
                      }}
                    >
                      {passed ? <CheckmarkIcon /> : index + 1}
                    </HStack>
                    <Stack
                      as="span"
                      $style={{
                        color:
                          disabled || passed
                            ? colors.textTertiary.toHex()
                            : colors.textPrimary.toHex(),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item}
                    </Stack>
                  </HStack>
                  {steps.length > index + 1 ? (
                    <Divider vertical={md} light />
                  ) : md ? (
                    <Stack as="span" />
                  ) : null}
                </Fragment>
              );
            })}
          </VStack>
          <Divider light />
          <VStack
            $style={{
              backgroundColor: colors.bgTertiary.toHex(),
              borderRadius: "20px",
              gap: "20px",
              padding: "20px",
            }}
          >
            <Form
              autoComplete="off"
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              requiredMark={false}
            >
              <Stack $style={{ display: step === 1 ? "block" : "none" }}>
                <Form.Item<Plugin>
                  name="logoUrl"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your plugin logo!",
                    },
                  ]}
                  valuePropName="fileList"
                >
                  <HStack $style={{ alignItems: "center", gap: "16px" }}>
                    <ImgCrop>
                      <Upload listType="picture-card" showUploadList={false}>
                        <VStack
                          $style={{
                            alignItems: "center",
                            backgroundColor: colors.bgTertiary.toHex(),
                            borderRadius: "12px",
                            color: colors.accentFour.toHex(),
                            height: "48px",
                            justifyContent: "center",
                            width: "48px",
                          }}
                        >
                          {<ImagesFiveIcon fontSize={24} />}
                        </VStack>
                      </Upload>
                    </ImgCrop>
                    <VStack $style={{ gap: "12px" }}>
                      <Stack
                        as="span"
                        $style={{ fontSize: "16px", lineHeight: "24px" }}
                      >
                        Choose Plugin Icon
                      </Stack>
                      <VStack
                        as="span"
                        $style={{
                          color: colors.textTertiary.toHex(),
                          fontSize: "12px",
                          lineHeight: "16px",
                        }}
                      >
                        JPG/PNG/WebP Recommended Square image
                      </VStack>
                    </VStack>
                  </HStack>
                </Form.Item>
                <Form.Item<Plugin>
                  name="bannerUrl"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your banner image!",
                    },
                  ]}
                  valuePropName="fileList"
                >
                  <ImgCrop aspect={4 / 3}>
                    <Upload.Dragger multiple={false} showUploadList={false}>
                      <VStack
                        $style={{
                          alignItems: "center",
                          backgroundColor: colors.bgTertiary.toHex(),
                          borderRadius: "12px",
                          color: colors.accentFour.toHex(),
                          height: "48px",
                          justifyContent: "center",
                          width: "48px",
                        }}
                      >
                        {<ImagesFiveIcon fontSize={24} />}
                      </VStack>
                      <Stack
                        as="span"
                        $style={{ fontSize: "16px", lineHeight: "24px" }}
                      >
                        Choose Plugin Banner
                      </Stack>
                      <VStack
                        as="span"
                        $style={{
                          color: colors.textTertiary.toHex(),
                          fontSize: "12px",
                          lineHeight: "16px",
                        }}
                      >
                        <Stack as="span">JPG/PNG/WebP aspect ratio 3:2</Stack>
                        <Stack as="span">recommended 1620 × 1080px size</Stack>
                      </VStack>
                    </Upload.Dragger>
                  </ImgCrop>
                </Form.Item>
                <Form.Item<Plugin>
                  label="Plugin Name"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin name!",
                    },
                  ]}
                >
                  <Input placeholder="e.g., DCA Plugin" />
                </Form.Item>
                <Form.Item<Plugin>
                  label="Plugin ID"
                  name="id"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin ID!",
                    },
                  ]}
                  extra="lowercase, kebab-case"
                >
                  <Input placeholder="e.g., vultisig-dca-1000" />
                </Form.Item>
                <Form.Item<Plugin>
                  label="Short Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin description!",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Briefly describe your plugin does" />
                </Form.Item>
                <Form.Item<Plugin>
                  label="Description Images"
                  name="images"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your plugin images!",
                    },
                  ]}
                  valuePropName="fileList"
                >
                  <Upload.Dragger multiple>
                    <VStack
                      $style={{
                        alignItems: "center",
                        backgroundColor: colors.bgTertiary.toHex(),
                        borderRadius: "12px",
                        color: colors.accentFour.toHex(),
                        height: "48px",
                        justifyContent: "center",
                        width: "48px",
                      }}
                    >
                      {<ImagesFiveIcon fontSize={24} />}
                    </VStack>
                    <Stack
                      as="span"
                      $style={{ fontSize: "16px", lineHeight: "24px" }}
                    >
                      Description Images
                    </Stack>
                    <VStack
                      as="span"
                      $style={{
                        color: colors.textTertiary.toHex(),
                        fontSize: "12px",
                        lineHeight: "16px",
                      }}
                    >
                      <Stack as="span">JPG/PNG/WebP Max images: 6</Stack>
                      <Stack as="span">Max file size per image: 2 MB</Stack>
                    </VStack>
                  </Upload.Dragger>
                </Form.Item>
              </Stack>
              <Stack $style={{ display: step === 2 ? "block" : "none" }}>
                <Form.Item<Plugin>
                  label="Server Endpoint"
                  name="serverEndpoint"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin server endpoint!",
                    },
                  ]}
                >
                  <Input placeholder="https://your-plugin.example.com" />
                </Form.Item>
                <Form.Item<Plugin>
                  label="Supported Blockchains"
                  name="supportedChains"
                  rules={[
                    {
                      required: true,
                      message: "Please select your supported blockchains!",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    options={Object.keys(chains).map((chain) => ({
                      label: chain,
                      value: chain,
                    }))}
                    placeholder="Select"
                  />
                </Form.Item>
              </Stack>
              <Stack $style={{ display: step === 4 ? "block" : "none" }}>
                <Form.Item<Plugin>
                  label="Contact Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your contact email!",
                    },
                  ]}
                >
                  <Input placeholder="https://your-plugin.example.com" />
                </Form.Item>
                <Form.Item label="Optional notes" name="notes">
                  <Input.TextArea placeholder="Any additional information or questions" />
                </Form.Item>
              </Stack>
            </Form>
          </VStack>
          <HStack $style={{ justifyContent: "center", gap: "12px" }}>
            {step > 1 && (
              <Button
                kind="secondary"
                onClick={() =>
                  setState((prev) => ({ ...prev, step: prev.step - 1 }))
                }
              >
                Back
              </Button>
            )}
            <Button
              icon={step === steps.length && <EmailTwoIcon fontSize={16} />}
              onClick={() => form.submit()}
            >
              {step === steps.length ? "Send to Vultisig Team" : "Continue"}
            </Button>
          </HStack>
          <Stack
            as="span"
            $style={{
              color: colors.textTertiary.toHex(),
              fontSize: "12px",
              lineHeight: "16px",
              textAlign: "center",
            }}
          >
            This will email your submission to dev@vultisig.com. Our team will
            follow up with next steps.
          </Stack>
        </VStack>
      </VStack>
    </>
  );
};
