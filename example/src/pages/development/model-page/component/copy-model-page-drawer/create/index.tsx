import { Form, Input, Button, Spin, message, Row, Col, Space } from 'antd';

import { useState, FC, useEffect } from 'react';

import { modelPageCreate, modelPageDetail } from '@/pages/development/model-page/services';

interface CreateCopyPageConfigProps {
  pageCode: string;
  modelCode: string;
}

const CreateCopyPageConfig: FC<CreateCopyPageConfigProps> = ({ pageCode, modelCode }) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleCreateSubmit = () => {
    form.validateFields(['pageCode', 'codeSuffix']).then((values) => {
      const { pageCode, codeSuffix } = values;
      setLoading(true);

      const nowPageCode = `${modelCode}_${codeSuffix}`;

      modelPageDetail({
        pageCode,
      })
        .then((res) => {
          const { data: currentDetail } = res;

          modelPageCreate({
            ...currentDetail,
            code: nowPageCode,
            codeSuffix,
          })
            .then((res) => {
              setLoading(false);
              message.success(`${nowPageCode} 页面模型创建成功`).then(() => void 0);
            })
            .catch(() => {
              message.warning(`新增页面编码: ${nowPageCode} 新增失败`).then(() => void 0);

              setLoading(false);
            });
        })
        .catch(() => {
          message.warning(`当前页面编码: ${nowPageCode} 不存在无法复制`).then(() => void 0);
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      pageCode,
    });
  }, [pageCode]);

  useEffect(() => {
    form.setFieldsValue({
      modelCode,
    });
  }, [modelCode]);



  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      form={form}
      initialValues={{
        pageCode,
        modelCode,
      }}
    >
      <Spin spinning={loading}>
        <Row gutter={32}>
          <Col span={16}>
            <Form.Item
              label="页面编码"
              name="pageCode"
              rules={[{ required: true, message: '当前页面编码 必须' }]}
            >
              <Input placeholder="请输入当前页面编码" disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="模型编码"
              name="modelCode"
              hidden
              rules={[{ required: true, message: '当前模型编码 必须' }]}
            >
              <Input hidden placeholder="请输入当前模型编码" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={16}>
            <Form.Item
              label="新增页面编码"
              name="codeSuffix"
              rules={[{ required: true, message: '新增页面编码 必须' }]}
              shouldUpdate={(cur, prev) => cur.modelCode !== prev.modelCode}
            >
              <Input addonBefore={`${modelCode}_`} placeholder="请输入新增页面编码" />
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
            <Button type="primary" loading={loading} onClick={handleCreateSubmit}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default CreateCopyPageConfig;
