import { nextTick } from 'vue';

const ParamConfig_fileClassifyChange = ({ field, form }) => {
  const val = field.value;

  nextTick(() => {
    const fieldName = 'sys-file-upload-file-format';

    form.query(fieldName).take((target) => {
      if (field.modified) {
        target.reset();
      }

      if (val && val.length) {
        target.setComponentProps({
          disabled: false,
          apiConfig: {
            url: '/system/sysDictItem/dict/list',
            data: {
              dictCode: 'sys.file.upload.file.classify',
              itemValues: val,
            },
          },
        });
      } else {
        target.setComponentProps({
          disabled: true,
          apiConfig: {
            url: '',
            data: {
              dictCode: 'sys.file.upload.file.classify',
              itemValues: val || [],
            },
          },
        });
      }
    });
  });
};

export default ParamConfig_fileClassifyChange;
