import {
  Form,
  FormProps,
  Select,
  Table,
  TableProps,
  theme as antTheme,
  Tooltip,
} from "antd";
import { useResponsive } from "antd-style";
import { Decimal } from "decimal.js";
import { debounce } from "lodash-es";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "styled-components";

import { getEarnings, getPlugin } from "@/api/portal";
import { DateView } from "@/components/DateView";
import { MiddleTruncate } from "@/components/MiddleTruncate";
import { useCore } from "@/hooks/useCore";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChartSixIcon } from "@/icons/ChartSixIcon";
import { NewspaperIcon } from "@/icons/NewspaperIcon";
import { PencilLineIcon } from "@/icons/PencilLineIcon";
import { PeopleAddedIcon } from "@/icons/PeopleAddedIcon";
import { SquareArrowOutTopLeftIcon } from "@/icons/SquareArrowOutTopLeftIcon";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";
import { HStack, Stack, VStack } from "@/toolkits/Stack";
import { earningStatuses, earningTypes } from "@/utils/constants";
import {
  camelCaseToTitle,
  getExplorerUrl,
  kebabCaseToTitle,
  match,
  toValueFormat,
} from "@/utils/functions";
import { routeTree } from "@/utils/routes";
import { Earning, EarningFilters, Plugin } from "@/utils/types";

type StateProps = {
  plugin?: Plugin;
  earnings: Earning[];
};

export const PluginEarningsPage = () => {
  const [state, setState] = useState<StateProps>({ earnings: [] });
  const { earnings, plugin } = state;
  const { token } = antTheme.useToken();
  const { baseValue, currency } = useCore();
  const { filters, setFilters } = useFilterParams<EarningFilters>();
  const { pluginId = "" } = useParams();
  const { md } = useResponsive();
  const [form] = Form.useForm<EarningFilters>();
  const colors = useTheme();

  const columns: TableProps<Earning>["columns"] = [
    {
      dataIndex: "feeAsset",
      key: "feeAsset",
      title: "From",
      render: (_, { feeAsset }) => {
        return (
          <MiddleTruncate $style={{ width: "140px" }}>
            {feeAsset.addr}
          </MiddleTruncate>
        );
      },
    },
    {
      align: "center",
      dataIndex: "type",
      key: "type",
      title: "Type",
      render: (_, { type }) => {
        return (
          <HStack $style={{ justifyContent: "center" }}>
            <Stack
              as="span"
              $style={{
                alignItems: "center",
                backgroundColor: colors.info.toRgba(0.05),
                borderRadius: "4px",
                color: colors.info.toHex(),
                fontSize: "12px",
                gap: "4px",
                lineHeight: "24px",
                padding: "0 8px",
                whiteSpace: "nowrap",
              }}
            >
              {kebabCaseToTitle(type).toUpperCase()}
            </Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "amount",
      key: "amount",
      title: "Amount",
      render: (_, { amount, feeAsset }) => {
        return (
          <Stack
            as="span"
            $style={{ color: colors.success.toHex() }}
          >{`${toValueFormat(
            new Decimal(amount)
              .mul(new Decimal(baseValue))
              .div(new Decimal(10).pow(feeAsset.decimals))
              .toString(),
            currency,
            feeAsset.decimals,
          )} ${feeAsset.symbol}`}</Stack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created At",
      render: (_, { createdAt }) => {
        return <DateView date={createdAt} />;
      },
    },
    {
      align: "center",
      dataIndex: "statusOnchain",
      key: "statusOnchain",
      title: "Status",
      render: (_, { status }) => {
        const color = match(status, {
          failed: () => colors.error,
          pending: () => colors.warning,
          completed: () => colors.success,
        });

        return (
          <HStack $style={{ justifyContent: "center" }}>
            <Stack
              as="span"
              $style={{
                alignItems: "center",
                backgroundColor: color.toRgba(0.05),
                borderRadius: "4px",
                color: color.toHex(),
                fontSize: "12px",
                gap: "4px",
                lineHeight: "24px",
                padding: "0 8px",
                whiteSpace: "nowrap",
              }}
            >
              {camelCaseToTitle(status)}
            </Stack>
          </HStack>
        );
      },
    },
    {
      align: "center",
      dataIndex: "txHash",
      key: "txHash",
      title: "Action",
      width: 100,
      render: (_, { txHash, feeAsset }) => {
        if (!txHash) return "-";

        const explorerUrl = getExplorerUrl(feeAsset.network, "tx", txHash);

        return (
          <HStack $style={{ gap: "8px", justifyContent: "center" }}>
            <Tooltip title="Details">
              <HStack
                as={Link}
                to={explorerUrl}
                target="_blank"
                $style={{
                  backgroundColor: colors.bgTertiary.toHex(),
                  borderRadius: "50%",
                  padding: "12px",
                }}
                $hover={{ color: colors.info.toHex() }}
              >
                <SquareArrowOutTopLeftIcon fontSize={16} />
              </HStack>
            </Tooltip>
          </HStack>
        );
      },
    },
  ];

  const debouncedHandleFilter = useMemo(
    () => debounce(setFilters, 500),
    [setFilters],
  );

  const handleFilter: FormProps["onValuesChange"] = (_, values) => {
    debouncedHandleFilter(values);
  };

  const fetchEarnings = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    form.setFieldsValue(filters);

    const earnings = await getEarnings({ ...filters, pluginId });

    setState((prev) => ({ ...prev, loading: false, earnings }));
  });

  const fetchPlugin = useEffectEvent(async () => {
    setState((prev) => ({ ...prev, loading: true, plugin: undefined }));

    const plugin = await getPlugin(pluginId);

    setState((prev) => ({ ...prev, loading: false, plugin }));
  });

  useEffect(() => {
    if (!plugin) return;

    fetchEarnings();
  }, [filters, plugin]);

  useEffect(() => {
    fetchPlugin();
  }, [pluginId]);

  const stats = [
    {
      color: colors.info,
      icon: ChartSixIcon,
      label: "Total Revenue",
      unit: "All time",
      value: "$3.5K",
    },
    {
      color: colors.success,
      icon: PeopleAddedIcon,
      label: "Active Users",
      unit: "Last 30 days",
      value: "426",
    },
    {
      color: colors.accentFour,
      icon: NewspaperIcon,
      label: "Transactions",
      unit: "Last 30 days",
      value: "1.8K",
    },
  ];

  if (!plugin) return <Spin centered />;

  return (
    <VStack
      $style={{
        gap: "16px",
        maxWidth: `${token.screenXL}px`,
        padding: "16px",
        width: "100%",
      }}
    >
      <HStack $style={{ gap: "16px", justifyContent: "space-between" }}>
        <HStack
          $style={{ alignItems: "center", gap: "12px", overflow: "hidden" }}
        >
          {plugin.logoUrl && (
            <Stack
              as="img"
              src={plugin.logoUrl}
              $style={{ borderRadius: "12px", height: "44px", width: "44px" }}
            />
          )}
          <Stack
            as="span"
            $style={{
              fontSize: "22px",
              lineHeight: "24px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {plugin.title}
          </Stack>
        </HStack>
        <Button
          href={routeTree.pluginUpdate.link(plugin.id)}
          icon={<PencilLineIcon fontSize={16} />}
          state={true}
        >
          {md && "Update Plugin"}
        </Button>
      </HStack>
      <Stack
        $style={{
          backgroundColor: colors.bgTertiary.toHex(),
          borderRadius: "20px",
          display: "grid",
          gap: "16px",
          gridTemplateColumns: md ? "repeat(3, 1fr)" : "repeat(1, 1fr)",
          padding: "20px",
        }}
      >
        {stats.map(({ color, icon, label, unit, value }, index) => (
          <HStack
            as="span"
            key={index}
            $style={{
              alignItems: "center",
              backgroundColor: color.toRgba(0.05),
              borderColor: color.toRgba(0.2),
              borderRadius: "12px",
              borderStyle: "solid",
              borderWidth: "1px",
              gap: "20px",
              padding: "18px 24px",
            }}
          >
            <Stack
              as={icon}
              $style={{ color: color.toHex(), fontSize: "24px" }}
            />
            <VStack $style={{ flexGrow: "1", gap: "16px" }}>
              <Stack
                as="span"
                $style={{
                  color: colors.textSecondary.toHex(),
                  fontSize: "14px",
                  lineHeight: "18px",
                }}
              >
                {label}
              </Stack>
              <HStack
                as="span"
                $style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack
                  as="span"
                  $style={{ fontSize: "20px", lineHeight: "24px" }}
                >
                  {value}
                </Stack>
                <Stack
                  as="span"
                  $style={{
                    color: colors.textSecondary.toHex(),
                    fontSize: "12px",
                    lineHeight: "14px",
                  }}
                >
                  {unit}
                </Stack>
              </HStack>
            </VStack>
          </HStack>
        ))}
      </Stack>
      <HStack
        $style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Stack
          as="span"
          $style={{
            fontSize: "22px",
            lineHeight: "24px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Transactions
        </Stack>
        <Form<EarningFilters> form={form} onValuesChange={handleFilter}>
          <HStack $style={{ gap: "16px" }}>
            <Form.Item<EarningFilters> name="status" noStyle>
              <Select
                options={earningStatuses.map((status) => ({
                  label: camelCaseToTitle(status),
                  value: status,
                }))}
                placeholder="Status"
                styles={{ root: { paddingBlock: 8, width: 110 } }}
                allowClear
              />
            </Form.Item>
            <Form.Item<EarningFilters> name="type" noStyle>
              <Select
                options={earningTypes.map((type) => ({
                  label: kebabCaseToTitle(type),
                  value: type,
                }))}
                placeholder="Type"
                styles={{ root: { paddingBlock: 8, width: 110 } }}
                allowClear
              />
            </Form.Item>
          </HStack>
        </Form>
      </HStack>
      <Table<Earning>
        columns={columns}
        dataSource={earnings}
        pagination={false}
        rowKey="id"
      />
    </VStack>
  );
};
