import { Form, Input, Button, Spin, message, Row, Col, Space } from 'antd';

import { useState, ChangeEvent, FC, useEffect } from 'react';
import { modelPageDetail, modelPageUpdate } from '@/pages/development/model-page/services';
import { RemoteSelect } from '@formlogic/component';

interface PageCopyPageConfigProps {
  fetchPageConfigDetail: (pageCode: string) => void;
  onCopyPageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pageCode: string;
  modelCode: string;
}

const CopyPageConfig: FC<PageCopyPageConfigProps> = ({
  onCopyPageChange,
  pageCode,
  modelCode,
  fetchPageConfigDetail,
}) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const updateCurrentPageConfig = (copyPageCode: string, model: string, extraParams: any) => {
    setLoading(true);
    modelPageDetail({
      pageCode: copyPageCode,
    })
      .then((res) => {
        setLoading(false);

        const { data: copyDetail } = res;

        if (copyDetail.model === model) {
          setLoading(true);
          modelPageUpdate({
            ...copyDetail,
            ...extraParams,
          })
            .then(() => {
              setLoading(false);
              message.success(`${extraParams.code} 页面模型复制成功`).then(() => void 0);

              fetchPageConfigDetail(extraParams.code);
            })
            .catch(() => {
              setLoading(false);
            });
        } else {
          message
            .warning(
              `两个页面模型不一致无法复制。
              当前页面编码: ${extraParams.code} 模型 ${modelCode};
              复制页面编码: ${copyPageCode} 模型 ${copyDetail.code},`,
            )
            .then(() => void 0);
        }
      })
      .catch(() => {
        message.warning(`复制页面编码: ${copyPageCode} 不存在无法复制`).then(() => void 0);

        setLoading(false);
      });
  };

  const handlePageSubmit = () => {
    form.validateFields().then((values) => {
      const { pageCode, copyPageCode } = values;
      setLoading(true);
      modelPageDetail({
        pageCode,
      })
        .then((res) => {
          const { data: currentDetail } = res;

          setLoading(false);

          const { code, model, name, codeSuffix } = currentDetail;

          updateCurrentPageConfig(copyPageCode, model, {
            code,
            name,
            codeSuffix,
            model,
          });
        })
        .catch(() => {
          message.warning(`当前页面编码: ${pageCode} 不存在无法复制`).then(() => void 0);
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
              <Input placeholder="请输入当前页面编码" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              label="来源页面编码"
              name="copyPageCode"
              rules={[{ required: true, message: '复制页面编码 必须' }]}
              shouldUpdate={(cur, prev) => cur.pageCode !== prev.pageCode}
            >
              <RemoteSelect
                apiConfig={{
                  method: 'get',
                  url: '/local-api/model-or-page/list',
                  params: { type: 'page', model: modelCode },
                }}
                optionLabelProp="value"
                labelTemplateKey="{{code}}-{{name}}"
                onChange={onCopyPageChange}
                filterData={[pageCode].filter((val) => val)}
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
            <Button type="primary" onClick={handlePageSubmit}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Spin>
    </Form>
  );
};

export default CopyPageConfig;
