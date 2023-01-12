import { FC, useEffect } from 'react';

import { Graph } from '@antv/x6';

import { Form, FormInstance, Row, Col } from 'antd';

import { LOGIC_TYPE_DATA } from '@/utils/constant';

import { apiUrl } from '@/service';
import { useMode } from '@/hooks';

import { Input, TextArea, RemoteSelect, StaticSelect } from '@formlogic/component';

interface HeaderProps {
  graph: Graph | undefined;
  code: string;
  form: FormInstance;
}

const Header: FC<HeaderProps> = ({ code, form }) => {
  const typeVal = Form.useWatch('type', form);
  const belongVal = Form.useWatch('belong', form);

  const { isDetail, isEditable } = useMode();

  const getAddonBefore = (belong, typeValue) => {
    if (typeValue === 'com') {
      return 'com_';
    }

    return belong ? `${belong}_` : '';
  };

  const handleTypeChange = () => {
    form.resetFields(['belong']);
  };

  useEffect(() => {
    const before = getAddonBefore(belongVal, typeVal);

    form?.setFieldValue('before', before);
  }, [belongVal, typeVal]);

  const disabledCode = !!code;

  return (
    <Form
      name="logic"
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      className="editor-header"
      form={form}
    >
      <Form.Item hidden name="before">
        <Input type="hidden" />
      </Form.Item>
      <Row
        gutter={12}
        style={{
          width: 'max-content',
          minWidth: '100%',
        }}
      >
        <Col span={8}>
          <Form.Item
            name="type"
            label="流程类型"
            required
            initialValue="com"
            rules={[{ required: true }]}
          >
            <StaticSelect
              data={LOGIC_TYPE_DATA}
              onChange={handleTypeChange}
              allowClear={false}
              disabled={disabledCode}
              readOnly={isDetail}
            />
          </Form.Item>
        </Col>

        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
          {({ getFieldValue }) => {
            const typeValue = getFieldValue('type');

            return typeValue !== 'com' ? (
              <Col span={8}>
                <Form.Item name="belong" label="所属" required rules={[{ required: true }]}>
                  <RemoteSelect
                    apiConfig={{
                      method: 'get',
                      url: apiUrl.localBelongList,
                      params: {
                        type: typeValue,
                      },
                    }}
                    disabled={disabledCode}
                    labelTemplateKey={'{{code}}-{{name}}'}
                    readOnly={isDetail}
                  />
                </Form.Item>
              </Col>
            ) : null;
          }}
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.before !== cur.before}>
          {({ getFieldValue }) => {
            const before = getFieldValue('before');

            const disabled = disabledCode || !before;

            return (
              <Col span={8}>
                <Form.Item
                  name="suffix"
                  hidden={disabled}
                  label="流程编码"
                  required
                  rules={[{ required: !disabled }]}
                >
                  <Input
                    readOnly={isDetail}
                    hidden={disabled}
                    addonBefore={before}
                    disabled={disabled}
                  />
                </Form.Item>

                <Form.Item name="code" hidden={!disabled} label="流程编码" required>
                  <Input hidden={!disabled} readOnly={isDetail} disabled={disabled} />
                </Form.Item>
              </Col>
            );
          }}
        </Form.Item>

        <Col span={8}>
          <Form.Item name="name" label="流程名称" required rules={[{ required: true }]}>
            <Input readOnly={isDetail} />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Form.Item
            name="remarks"
            label="流程说明"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
          >
            <TextArea autoSize={{ minRows: 1, maxRows: 2 }} readOnly={isDetail} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Header;
