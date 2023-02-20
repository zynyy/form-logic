import { defineComponent } from 'vue';
import { Upload as AntdUpload } from 'ant-design-vue/lib/components';
import CustomButton from '@/components/custom-button';
import { UploadOutlined } from '@ant-design/icons-vue';
import { ArrayBaseUploadProps, getArrayBaseUploadProps } from '../interface';
import { useArrayContext } from '@/components/array-base/hooks';
import { UploadChangeParam } from 'ant-design-vue';
import { useField } from '@/formily-vue';
import { VoidField } from '@formily/core';

const ArrayBaseUpload = defineComponent({
  name: 'ArrayBaseUpload',
  inheritAttrs: false,
  props: getArrayBaseUploadProps(),
  setup(props: ArrayBaseUploadProps) {
    const array = useArrayContext();
    const fieldRef = useField<VoidField>();

    const handleChange = (info: UploadChangeParam) => {
      const field = fieldRef.value;

      const { onChange } = props;

      const modelsFiled = {
        field,
        form: field.form,
        arrayField: array.field,
      };

      if (array?.props?.onUpload) {
        return array?.props?.onUpload(info, modelsFiled);
      }

      if (onChange) {
        return onChange(info,modelsFiled);
      }
    };

    return () => {
      const { ...uploadProps } = props;

      return (
        <AntdUpload {...uploadProps} onChange={handleChange} showUploadList={false}>
          <CustomButton
            v-slots={{
              icon: () => <UploadOutlined />,
            }}
          />
        </AntdUpload>
      );
    };
  },
});

export default ArrayBaseUpload;
