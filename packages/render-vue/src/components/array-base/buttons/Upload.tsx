import { defineComponent } from 'vue';
import { Upload as AntdUpload } from 'ant-design-vue/lib/components';
import CustomButton from '@/components/custom-button';
import { UploadOutlined } from '@ant-design/icons-vue';
import { ArrayBaseUploadProps, getArrayBaseUploadProps } from '../interface';

const ArrayBaseUpload = defineComponent({
  name: 'ArrayBaseUpload',
  inheritAttrs: false,
  props: getArrayBaseUploadProps(),
  setup(props: ArrayBaseUploadProps) {
    return () => {
      const { ...uploadProps } = props;

      return (
        <AntdUpload {...uploadProps} showUploadList={false}>
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
