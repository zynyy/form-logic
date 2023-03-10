import { Form, Input, Button, Spin, message, Row, Col, Space } from 'antd';

import { useState, FC, ChangeEvent, useEffect } from 'react';
import { RemoteSelect, StaticSelect, toArray } from '@formlogic/component';
import {
  checkRepeat,
  findRecord,
  transformData,
} from '@/pages/development/model-page/component/copy-model-page-drawer/utils';
import { modelPageUpdate } from '@/pages/development/model-page/services';

interface FieldCopyPageConfigProps {
  pageConfig: DynamicObjectAny;
  copyPageConfig: DynamicObjectAny;
  onPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCopyPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fetchPageConfigDetail: (pageCode: string) => void;
  copyPageCode: string;
  pageCode: string;
}

const FieldCopyPageConfig: FC<FieldCopyPageConfigProps> = ({
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

  const handleFieldSubmit = () => {
    form.validateFields().then((values) => {
      const { pageCode, field, copyField } = values;

      const nowFields = toArray(field);
      const nowCopyFields = toArray(copyField);

      const { data, ...restDetail } = pageConfig;
      const { data: copyPage } = copyPageConfig;

      const addFields = toArray(nowCopyFields).filter((key) => {
        return !toArray(nowFields).includes(key);
      });

      const params = {
        ...restDetail,
        data: data
          .map((item: any) => {
            const { code, type } = item;

            const nowField = `${code}_${type}`;

            if (nowFields.includes(nowField) && nowCopyFields.includes(nowField)) {
              return findRecord(copyPage, nowField) || item;
            }

            return item;
          })
          .concat(
            addFields.map((key: string) => {
              return findRecord(copyPage, key);
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
          message.success(`${pageCode} ????????????????????????`).then(() => void 0);

          form.resetFields(['field', 'copyField']);

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
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
      initialValues={{
        pageCode,
        type: 'field',
        copyPageCode,
      }}
    >
      <Spin spinning={loading}>
        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              label="??????????????????"
              name="pageCode"
              rules={[{ required: true, message: '?????????????????? ??????' }]}
            >
              <Input placeholder="???????????????????????????" disabled onChange={onPageChange} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="????????????"
              name="field"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
            >
              <StaticSelect
                labelTemplateKey="{{code}}-{{name}}"
                data={transformData(pageConfig.data)}
                mode="multiple"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              label="??????????????????"
              name="copyPageCode"
              rules={[{ required: true, message: '?????????????????? ??????' }]}
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
              label="????????????"
              name="copyField"
              rules={[{ required: true, message: '???????????? ??????' }]}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
            >
              <StaticSelect
                data={transformData(copyPageConfig.data)}
                labelTemplateKey="{{code}}-{{name}}"
                mode="multiple"
              />
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
            <Button type="primary" onClick={handleFieldSubmit}>
              ??????
            </Button>
          </Space>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default FieldCopyPageConfig;
