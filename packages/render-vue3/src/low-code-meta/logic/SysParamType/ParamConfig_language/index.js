import { nextTick } from 'vue';

const ParamConfig_language = ({ field, form, ...rest }) => {
  const val = field.value;

  nextTick(() => {
    const fieldName = 'user-default-language';

    form.query(fieldName).take((target) => {
      if (field.modified) {
        target.reset();
      }

      if (Array.isArray(val) && val.length) {
        target.setComponentProps({
          disabled: false,
          includeData: val,
        });
      } else {
        target.setComponentProps({
          disabled: true,
          includeData: [],
        });
      }
    });
  });
};

export default ParamConfig_language;
