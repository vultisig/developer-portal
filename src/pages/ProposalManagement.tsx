import {
  Form,
  FormProps,
  Input,
  Masonry,
  Select,
  theme as antTheme,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useResponsive } from "antd-style";
import { FC, Fragment, useEffect, useEffectEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { createProposal, getProposal, validatePluginId } from "@/api/portal";
import { StatusModal } from "@/components/StatusModal";
import { useAntd } from "@/hooks/useAntd";
import { useGoBack } from "@/hooks/useGoBack";
import { CheckmarkIcon } from "@/icons/CheckmarkIcon";
import { CrossLargeIcon } from "@/icons/CrossLargeIcon";
import { EmailTwoIcon } from "@/icons/EmailTwoIcon";
import { ImagesFiveIcon } from "@/icons/ImagesFiveIcon";
import { Button } from "@/toolkits/Button";
import { Divider } from "@/toolkits/Divider";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { chains } from "@/utils/chain";
import { parseBase64DataUrl, tinyId, urlToBase64 } from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Image, ImageMime, Proposal } from "@/utils/types";

const steps = [
  "Plugin Basics",
  "Technical Details",
  // "plugin-config.yaml",
  "Contact Info",
] as const;

type StateProps = {
  error?: string;
  proposal?: Proposal;
  loaded?: boolean;
  step: number;
  submitting?: boolean;
  success?: string;
};

export const ProposalManagementPage = () => {
  const [state, setState] = useState<StateProps>({ step: 1 });
  const { error, loaded, step, proposal, submitting, success } = state;
  const { token } = antTheme.useToken();
  const { onFinishFailed } = useAntd();
  const { pluginId = "" } = useParams();
  const { md } = useResponsive();
  const [form] = Form.useForm<Proposal>();
  const goBack = useGoBack();
  const colors = useTheme();

  const handleFinish: FormProps<Proposal>["onFinish"] = ({
    logo,
    media = [],
    thumbnail,
    ...values
  }) => {
    if (submitting) return;

    if (step < steps.length) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    } else {
      const images: Pick<
        Image,
        "contentType" | "data" | "filename" | "type"
      >[] = [];

      if (logo) {
        const { base64, mime } = parseBase64DataUrl(logo);

        images.push({
          contentType: mime as ImageMime,
          data: base64,
          filename: `logo-${tinyId()}`,
          type: "logo",
        });
      }

      if (thumbnail) {
        const { base64, mime } = parseBase64DataUrl(thumbnail);

        images.push({
          contentType: mime as ImageMime,
          data: base64,
          filename: `thumbnail-${tinyId()}`,
          type: "thumbnail",
        });
      }

      media.forEach((image) => {
        const { base64, mime } = parseBase64DataUrl(image);

        images.push({
          contentType: mime as ImageMime,
          data: base64,
          filename: `media-${tinyId()}`,
          type: "media",
        });
      });

      values.category = "app";
      values.images = images as Image[];

      setState((prev) => ({ ...prev, submitting: true }));

      createProposal(values)
        .then(() => {
          setState((prev) => ({
            ...prev,
            submitting: false,
            success: "Your proposal has been submitted!",
          }));
        })
        .catch((error) => {
          setState((prev) => ({
            ...prev,
            error: error?.error,
            submitting: false,
          }));
        });
    }
  };

  const fetchProposal = useEffectEvent(async (pluginId: string) => {
    if (pluginId) {
      setState((prev) => ({ ...prev, loaded: false }));

      const { images, ...plugin } = await getProposal(pluginId);

      const logoUrl = images.find(({ type }) => type === "logo")?.url;
      const thumbnailUrl = images.find(({ type }) => type === "thumbnail")?.url;

      if (logoUrl) plugin.logo = await urlToBase64(logoUrl);
      if (thumbnailUrl) plugin.thumbnail = await urlToBase64(thumbnailUrl);

      setState((prev) => ({ ...prev, loaded: true }));

      form.setFieldsValue(plugin);
    } else {
      setState((prev) => ({ ...prev, loaded: true }));
    }
  });

  useEffect(() => {
    fetchProposal(pluginId);
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
            {!proposal
              ? "Register a New Plugin"
              : `Edit ${proposal.title} Plugin`}
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
            <Form<Proposal>
              autoComplete="off"
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              onFinishFailed={(errorInfo) => onFinishFailed(errorInfo, form)}
              requiredMark={false}
            >
              <Stack $style={{ display: step === 1 ? "block" : "none" }}>
                <Form.Item<Proposal>
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your plugin logo!",
                    },
                  ]}
                >
                  <UploadLogo />
                </Form.Item>
                <Form.Item<Proposal>
                  name="thumbnail"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your thumbnail image!",
                    },
                  ]}
                >
                  <UploadThumbnail />
                </Form.Item>
                <Form.Item<Proposal> name="banner">
                  <UploadBanner />
                </Form.Item>
                <Form.Item<Proposal>
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
                <Form.Item<Proposal>
                  extra="lowercase, kebab-case"
                  label="Plugin ID"
                  name="pluginId"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin ID!",
                    },
                    {
                      pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                      message: "Plugin ID must be lowercase and kebab-case!",
                    },
                    {
                      validator: async (_, value) => {
                        if (!value || step > 1) return;

                        const available = await validatePluginId(value);

                        if (!available) {
                          return Promise.reject(
                            new Error("This plugin ID is already taken!"),
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="e.g., vultisig-dca-1000" />
                </Form.Item>
                <Form.Item<Proposal>
                  label="Short Description"
                  name="shortDescription"
                  rules={[
                    {
                      required: true,
                      message: "Please input your plugin description!",
                    },
                  ]}
                >
                  <Input.TextArea placeholder="Briefly describe your plugin does" />
                </Form.Item>
                <Form.Item<Proposal> label="Description Images" name="media">
                  <UploadMedia />
                </Form.Item>
              </Stack>
              <Stack $style={{ display: step === 2 ? "block" : "none" }}>
                <Form.Item<Proposal>
                  label="Server Endpoint"
                  name="serverEndpoint"
                  rules={[
                    {
                      required: step > 1,
                      message: "Please input your plugin server endpoint!",
                    },
                  ]}
                >
                  <Input placeholder="https://your-plugin.example.com" />
                </Form.Item>
                <Form.Item<Proposal>
                  label="Supported Blockchains"
                  name="supportedChains"
                  rules={[
                    {
                      required: step > 1,
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
              <Stack $style={{ display: step === 3 ? "block" : "none" }}>
                <Form.Item<Proposal>
                  label="Contact Email"
                  name="contactEmail"
                  rules={[
                    {
                      required: step > 2,
                      message: "Please input your contact email!",
                    },
                    {
                      type: "email",
                      message: "Please input a valid contact email!",
                    },
                  ]}
                >
                  <Input placeholder="contact@example.com" />
                </Form.Item>
                <Form.Item<Proposal> label="Optional notes" name="notes">
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
              loading={submitting}
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

      <StatusModal
        onClose={() => goBack(routeTree.proposals.path)}
        open={Boolean(success)}
        success
      >
        <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
          Submission Successful
        </Stack>
        <Stack
          as="span"
          $style={{ color: colors.textTertiary.toHex(), lineHeight: "18px" }}
        >
          {success}
        </Stack>
      </StatusModal>

      <StatusModal
        onClose={() => setState((prev) => ({ ...prev, error: undefined }))}
        open={Boolean(error)}
      >
        <Stack as="span" $style={{ fontSize: "22px", lineHeight: "24px" }}>
          Submission Failed
        </Stack>
        <Stack
          as="span"
          $style={{ color: colors.textTertiary.toHex(), lineHeight: "18px" }}
        >
          {error}
        </Stack>
      </StatusModal>
    </>
  );
};

const UploadBanner: FC<{
  onChange?: (value?: string) => void;
  value?: string;
}> = ({ onChange, value }) => {
  const { beforeUpload } = useAntd();
  const form = Form.useFormInstance<Proposal>();
  const colors = useTheme();

  return (
    <VStack id="banner">
      <ImgCrop aspect={16 / 9}>
        <Upload.Dragger
          beforeUpload={(file) =>
            beforeUpload({
              dimensions: { height: 1080, width: 1920 },
              file,
              form,
              name: "banner",
              onChange: (base64) => onChange?.(base64),
              size: 2,
            })
          }
          listType="picture-card"
          multiple={false}
          showUploadList={false}
        >
          {value ? (
            <VStack as="img" src={value} $style={{ width: "100%" }} />
          ) : (
            <VStack
              $style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                justifyContent: "center",
                padding: "40px",
              }}
            >
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
                <Stack as="span">JPG/PNG/WebP aspect ratio 16:9</Stack>
                <Stack as="span">Recommended 1920 × 1080px size</Stack>
              </VStack>
            </VStack>
          )}
        </Upload.Dragger>
      </ImgCrop>
    </VStack>
  );
};

const UploadLogo: FC<{
  onChange?: (value: string) => void;
  value?: string;
}> = ({ onChange, value }) => {
  const { beforeUpload } = useAntd();
  const form = Form.useFormInstance<Proposal>();
  const colors = useTheme();

  return (
    <HStack id="logo" $style={{ alignItems: "center", gap: "16px" }}>
      <ImgCrop>
        <Upload
          beforeUpload={(file) =>
            beforeUpload({
              dimensions: { height: 512, width: 512 },
              file,
              form,
              name: "logo",
              onChange: (base64) => onChange?.(base64),
              size: 2,
            })
          }
          listType="picture-card"
          multiple={false}
          showUploadList={false}
        >
          {value ? (
            <VStack as="img" src={value} $style={{ width: "100%" }} />
          ) : (
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
          )}
        </Upload>
      </ImgCrop>
      <VStack $style={{ gap: "12px" }}>
        <Stack as="span" $style={{ fontSize: "16px", lineHeight: "24px" }}>
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
          JPG/PNG/WebP Recommended 512px × 512px size
        </VStack>
      </VStack>
    </HStack>
  );
};

const UploadMedia: FC<{
  onChange?: (value: string[]) => void;
  value?: string[];
}> = ({ onChange, value = [] }) => {
  const { sm } = useResponsive();
  const { beforeUpload } = useAntd();
  const form = Form.useFormInstance<Proposal>();
  const colors = useTheme();

  return (
    <VStack id="media" $style={{ gap: "16px" }}>
      {value.length > 0 && (
        <Masonry
          columns={sm ? 2 : 1}
          gutter={16}
          items={value.map((data, key) => ({ data, key }))}
          itemRender={({ data, key }) => (
            <VStack $style={{ position: "relative" }}>
              <HStack
                as="span"
                onClick={() => onChange?.(value.filter((_, i) => i !== key))}
                $style={{
                  backgroundColor: colors.bgPrimary.toRgba(0.1),
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "12px",
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                }}
                $hover={{ backgroundColor: colors.bgPrimary.toRgba(0.2) }}
              >
                <CrossLargeIcon fontSize={16} />
              </HStack>
              <Stack
                as="img"
                alt="Media image"
                src={data}
                $style={{ borderRadius: "12px", width: "100%" }}
              />
            </VStack>
          )}
        />
      )}
      <Upload.Dragger
        beforeUpload={(file) =>
          beforeUpload({
            dimensions: { height: 1080, width: 1920 },
            file,
            form,
            name: "logo",
            onChange: (base64) => onChange?.([...value, base64]),
            size: 2,
          })
        }
        listType="picture-card"
        multiple={false}
        disabled={value.length >= 6}
        showUploadList={false}
      >
        <VStack
          $style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "center",
            padding: "40px",
          }}
        >
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
          <Stack as="span" $style={{ fontSize: "16px", lineHeight: "24px" }}>
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
        </VStack>
      </Upload.Dragger>
    </VStack>
  );
};

const UploadThumbnail: FC<{
  onChange?: (value?: string) => void;
  value?: string;
}> = ({ onChange, value }) => {
  const { beforeUpload } = useAntd();
  const form = Form.useFormInstance<Proposal>();
  const colors = useTheme();

  return (
    <VStack id="thumbnail">
      <ImgCrop aspect={3 / 2}>
        <Upload.Dragger
          beforeUpload={(file) =>
            beforeUpload({
              dimensions: { height: 600, width: 800 },
              file,
              form,
              name: "logo",
              onChange: (base64) => onChange?.(base64),
              size: 2,
            })
          }
          listType="picture-card"
          multiple={false}
          showUploadList={false}
        >
          {value ? (
            <VStack as="img" src={value} $style={{ width: "100%" }} />
          ) : (
            <VStack
              $style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                justifyContent: "center",
                padding: "40px",
              }}
            >
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
                Choose Plugin Thumbnail
              </Stack>
              <VStack
                as="span"
                $style={{
                  color: colors.textTertiary.toHex(),
                  fontSize: "12px",
                  lineHeight: "16px",
                }}
              >
                <Stack as="span">JPG/PNG/WebP aspect ratio 4:3</Stack>
                <Stack as="span">Recommended 800px × 600px size</Stack>
              </VStack>
            </VStack>
          )}
        </Upload.Dragger>
      </ImgCrop>
    </VStack>
  );
};
