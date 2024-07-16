import { getFormValues, getSubmitFormValues } from '@formlogic/render-core-vue3';
import { nextTick } from 'vue';

import com_save from '@/common-logic/com_save';

import ParamConfig_fileClassifyChange from './SysParamType/ParamConfig_fileClassifyChange';
import ParamConfig_language from './SysParamType/ParamConfig_language';

const com_targetWithValues = (...arg: any[]) => {};

const clickSave = ({ form }) => {
  getFormValues(form);
  getSubmitFormValues(form)
    .then((formValues) => {
      console.log(formValues);
    })
    .catch((err) => {});
};

const com_testSum = (args) => {
  const { logicParams, form } = args;
  const { sum, targetKey } = logicParams;

  const total = sum.reduce((acc, key) => {
    return acc + Number(form.values[key] || 0);
  }, 0);

  form.setValuesIn(targetKey, total);
};

const com_tenantHidden = ({ field }) => {
  // field.visible = false;
};

const com_enableGroupRequired = ({ field, form }) => {
  const required = field.value === '0';

  const isArray = field.index > -1;
  const setRequired = (nowParent) => {
    const fields = nowParent.invoke('fields');
    if (!fields) {
      if (nowParent.parent) {
        setRequired(nowParent.parent);
      }
    } else {
      fields.forEach((key) => {
        field.query(isArray ? `.${key}` : key).take((target) => {
          if (target.address.entire !== field.address.entire) {
            if (target.data.initRequired) {
              target.required = required;
            }
            form.clearErrors(key);
          }
        });
      });
    }
  };

  nextTick(() => {
    setRequired(field.parent);
  });
};

const loader = {
  com_targetWithValues,
  clickSave,
  com_testSum,
  ParamConfig_fileClassifyChange,
  ParamConfig_language,
  com_tenantHidden,
  com_save,
  com_enableGroupRequired,
};

const getLogicConfig = (logicCode) => {
  console.log(logicCode);
};

export default getLogicConfig;
