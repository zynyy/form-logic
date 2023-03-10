import {Form} from "antd";

import {FC} from "react";
import {SettingConfigType} from "../interface";
import { useMode } from '@/hooks';

import {Input} from '@formlogic/component';

export interface ProcessConfigProps extends SettingConfigType {}

const ProcessConfig: FC<ProcessConfigProps> = ({ selected }) => {
  const [form] = Form.useForm();

  const { isDetail } = useMode();

  const handleChange = () => {
    if (selected) {
      form.validateFields().then((values) => {
        selected.updateData({
          configValues: values,
        });
        const { label } = values || {};
        if (selected.isNode()) {
          // @ts-ignore
          selected.label = label;

          selected.updateAttrs({
            label: {
              text: label,
            },
          });
          selected.fit();
        }
      });
    }
  };

  return (
    <Form
      form={form}
      onValuesChange={handleChange}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 20,
      }}
      initialValues={selected?.data.configValues || {}}
    >
      <Form.Item label="名称" name="label">
        <Input readOnly={isDetail} />
      </Form.Item>
    </Form>
  );
};

export default ProcessConfig;
