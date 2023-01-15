import { Form, Input, Button, Spin, message, Row, Col, Space } from 'antd';

import { useState, ChangeEvent, FC, useEffect } from 'react';
import { RemoteSelect, StaticSelect, toArray } from '@formlogic/component';
import { modelPageUpdate } from '@/pages/development/model-page/services';
import { checkRepeat } from '@/pages/development/model-page/component/copy-model-page-drawer/utils';

interface GroupCopyPageConfigProps {
  pageConfig: DynamicObjectAny;
  copyPageConfig: DynamicObjectAny;
  onPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCopyPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fetchPageConfigDetail: (pageCode: string) => void;
  copyPageCode: string;
  pageCode: string;
}

const CopyGroupPageConfig: FC<GroupCopyPageConfigProps> = ({
  pageConfig,
  copyPageConfig,
  onCopyPageChange,
  onPageChange,
  fetchPageConfigDetail,
  copyPageCode,
  pageCode,
}) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleGroupSubmit = () => {
    form.validateFields().then((values) => {
      const { pageCode, copyGroup, group } = values;

      const { data, _id, group: originGroup, ...restDetail } = pageConfig;
      const { data: copyPage, group: copyGroupData } = copyPageConfig;

      if (!group && originGroup.find((cur: any) => cur.code === copyGroup)) {
        message
          .warning(
            `当前页面编码: ${pageCode} 已存在分组 ${copyGroup} 会导致重复无法复制, 如果要覆盖请把目标分组设置为这个`,
          )
          .then(() => void 0);
        return;
      }

      const params = group
        ? {
            ...restDetail,
            group: originGroup.map((item: any) => {
              const { code, name } = item;

              if (code === group) {
                const record = copyGroupData.find((cur: any) => cur.code === copyGroup) || {};
                return {
                  ...record,
                  code,
                  name,
                };
              }
              return item;
            }),
            data: data
              .filter((item: any) => {
                return item?.group !== group;
              })
              .concat(
                copyPage
                  .filter((item: any) => {
                    return item.group === copyGroup;
                  })
                  .map((item: any) => {
                    return {
                      ...item,
                      group: group,
                    };
                  }),
              ),
          }
        : {
            ...restDetail,
            group: toArray(originGroup)
              .concat(copyGroupData.find((cur: any) => cur.code === copyGroup))
              .filter((val) => val),
            data: toArray(data).concat(
              copyPage
                .filter((item: any) => {
                  return item.group === copyGroup;
                })
                .map((item: any) => {
                  return {
                    ...item,
                    group: copyGroup,
                  };
                }),
            ),
          };

      if (checkRepeat(params.data)) {
        return;
      }

      setLoading(true);
      modelPageUpdate(params)
        .then(() => {
          setLoading(false);
          message.success(`${pageCode} 页面分组复制成功`).then(() => void 0);
          form.resetFields(['group', 'copyGroup']);

          fetchPageConfigDetail(pageCode);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      copyPageCode,
    });
  }, [copyPageCode]);

  useEffect(() => {
    form.setFieldsValue({
      pageCode,
    });
  }, [pageCode]);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        pageCode,
        type: 'group',
        copyPageCode,
      }}
    >
      <Spin spinning={loading}>
        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              label="目标页面编码"
              name="pageCode"
              rules={[{ required: true, message: '当前页面编码 必须' }]}
            >
              <Input placeholder="请输入当前页面编码" disabled onChange={onPageChange} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="目标分组" name="group">
              <StaticSelect data={pageConfig?.group || []} showSearch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              label="来源页面编码"
              name="copyPageCode"
              rules={[{ required: true, message: '复制页面编码 必须' }]}
            >
              <RemoteSelect
                apiConfig={{
                  method: 'get',
                  url: '/local-api/model-or-page/list',
                  params: { type: 'page' },
                }}
                optionLabelProp="value"
                labelTemplateKey="{{code}}-{{name}}"
                onChange={onCopyPageChange}
              />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              label="来源分组"
              name="copyGroup"
              rules={[{ required: true, message: '来源分组 必须' }]}
            >
              <StaticSelect data={copyPageConfig?.group || []} showSearch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          wrapperCol={{
            span: 16,
            offset: 8,
          }}
        >
          <Space>
            <Button type="primary" loading={loading} onClick={handleGroupSubmit}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default CopyGroupPageConfig;
