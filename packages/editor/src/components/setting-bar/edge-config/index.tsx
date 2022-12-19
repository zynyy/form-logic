import {Form, Input} from "antd";

import {FC} from "react";
import {SettingConfigType} from "../interface";

export interface EdgeConfigProps extends SettingConfigType {}

const EdgeConfig: FC<EdgeConfigProps> = ({ selected }) => {
  const [form] = Form.useForm();

  const handleChange = () => {
    if (selected) {
      form.validateFields().then((values) => {
        selected.updateData({
          configValues: values,
        });

        const { label } = values || {};

        if (selected.isEdge()) {
          // @ts-ignore
          selected.label = label;

          selected.setLabels([
            {
              attrs: { label: { text: label } },
            },
          ]);
        }
      });
    }
  };

  return (
    <Form
      form={form}
      onValuesChange={handleChange}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={selected?.data.configValues|| {}}
    >
      <Form.Item label="名称" name="label">
        <Input />
      </Form.Item>

      <Form.Item label="值" name="code">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default EdgeConfig;
