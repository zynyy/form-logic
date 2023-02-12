import { Button, Popconfirm, Tooltip } from 'ant-design-vue';
import { CustomButtonMode } from '@/interface';
import { defineComponent, ref } from 'vue';
import { getCustomButtonProps, CustomButtonProps } from '@/components/custom-button/interface';

const CustomButton = defineComponent({
  name: 'CustomButton',
  inheritAttrs: false,
  props: getCustomButtonProps(),
  slot: ['icon'],
  setup: (props: CustomButtonProps, { slots, attrs }) => {
    const popConfirmOpen = ref(false);
    const tooltipOpen = ref(false);

    const handleConfirmOpenChange = (open) => {
      tooltipOpen.value = false;

      if (!props.disabled) {
        popConfirmOpen.value = open;
      } else {
        popConfirmOpen.value = false;
      }
    };

    const handleTooltipOpenChange = (open) => {
      if (popConfirmOpen.value) {
        return;
      }

      tooltipOpen.value = open;
    };

    return () => {
      const { title, hasTooltip, hasPopConfirm, onClick, mode, disabled, type, ...btnProps } =
        props;

      const renderButton = () => {
        if (mode === CustomButtonMode.icon) {
          return (
            <Button
              type={type ?? 'text'}
              {...btnProps}
              disabled={disabled}
              onClick={hasPopConfirm ? undefined : onClick}
              v-slots={slots}
            />
          );
        }

        return (
          <Button
            type={type ?? 'dashed'}
            {...btnProps}
            disabled={disabled}
            onClick={hasPopConfirm ? undefined : onClick}
            v-slots={slots}
          >
            {title}
          </Button>
        );
      };

      if (hasTooltip && hasPopConfirm) {
        return (
          <Popconfirm
            onVisibleChange={handleConfirmOpenChange}
            title={`是否确定${title}`}
            onConfirm={onClick}
            visible={popConfirmOpen.value}
          >
            <span>
              <Tooltip
                title={title}
                visible={tooltipOpen.value}
                onVisibleChange={handleTooltipOpenChange}
              >
                {renderButton()}
              </Tooltip>
            </span>
          </Popconfirm>
        );
      }

      if (hasTooltip) {
        return <Tooltip title={title}>{renderButton()}</Tooltip>;
      }

      if (hasPopConfirm) {
        return (
          <Popconfirm
            title={`是否确定${title}`}
            onVisibleChange={handleConfirmOpenChange}
            onConfirm={onClick}
            visible={popConfirmOpen.value}
          >
            {renderButton()}
          </Popconfirm>
        );
      }

      return renderButton();
    };
  },
});

export default CustomButton;
