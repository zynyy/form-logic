import { defineComponent, ref } from 'vue';
import { Button, Popover } from 'ant-design-vue';
import { RecursionField, useField, useFieldSchema } from '@/formily-vue';
import { MenuOutlined } from '@ant-design/icons-vue';

const PopoverBtn = defineComponent({
  name: 'PopoverBtn',
  inheritAttrs: false,
  setup() {
    const schema = useFieldSchema();

    const openRef = ref(false);

    const field = useField();

    const handleOpenChange = (nextOpen: boolean) => {
      openRef.value = nextOpen;
    };

    return () => {
      return (
        <Popover
          content={
            <RecursionField
              schema={schema.value}
              onlyRenderProperties
              basePath={field.value.address}
            />
          }
          trigger="hover"
          visible={openRef.value}
          onVisibleChange={handleOpenChange}
        >
          <Button
            v-slots={{
              icon: () => <MenuOutlined />,
            }}
            type="text"
            size="small"
          />
        </Popover>
      );
    };
  },
});

export default PopoverBtn;
