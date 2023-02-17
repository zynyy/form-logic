import ModalForm from './ModalPageForm';
import { useCreateForm, useListSchema } from '@/hooks';

import Logic_L from '../low-code-meta/model-page/Logic/Logic_L.json';

import { computed, ref } from 'vue';

import '../style';
import { uid } from '@formily/shared';
import { Button } from 'ant-design-vue';
import { requestGet } from '@/utils/request';
import getLogicConfig from '@/low-code-meta/logic';
import { TransformsSchemaOptions } from '@/transforms';

import 'ant-design-vue/dist/antd.css';
import { useJsonMetaSchema } from '@/hooks/useJsonMetaSchema';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ModalForm',
  component: ModalForm,
  argTypes: {
    config: {
      description: 'meta schema render',
    },
  },
};

const render = ({ pageCode, code, ...args }) => ({
  components: { ModalForm },
  setup() {
    //👇 The args will now be passed down to the template

    const formConfig = ref();

    const options = ref<TransformsSchemaOptions>(null);

    const visible = ref();

    const { metaSchema } = useJsonMetaSchema(ref(pageCode));

    const fetchDetail = () => {
      requestGet('local-api/model-page/detail', { pageCode: code }).then((res) => {
        const { data } = res;

        formConfig.value = {
          initialValues: data,
        };

        setTimeout(() => {
          options.value = { metaSchema: metaSchema.value, pattern: 'EDITABLE' };
        }, 100)


      });
    };

    const handleClick = () => {
      fetchDetail();
      visible.value = true;
    };

    const handleClose = () => {
      visible.value = false;
    }

    return () => {
      return (
        <>
          <Button onClick={handleClick}>点击打开</Button>
          <ModalForm
            options={options.value}
            visible={visible.value}
            formConfig={formConfig.value}
            hasConfirmButton={false}
            getLogicConfig={getLogicConfig}
            onClose={handleClose}
          />
        </>
      );
    };
  },
});

export const basic = {
  render,
  args: {
    code: 'ModelPage_Data_C',
    pageCode: 'ModelPage_U',
  },
};
