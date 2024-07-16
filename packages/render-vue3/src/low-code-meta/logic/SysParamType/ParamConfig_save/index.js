import {
  dashToDot,
  dotToDash,
  getSubmitFormValues,
  request,
} from '@cndinfo/code-render';

const sysParamInfo = (sysParamInfoList, setPageLoading) => {
  setPageLoading(true);
  request({
    url: '/system/sysParamInfo',
    method: 'post',
    data: {
      sysParamInfoList,
    },
  })
    .then(() => {
      setPageLoading(false);
    })
    .catch(() => {
      setPageLoading(false);
    });
};

const paramConfigSave = ({ form, extraLogicParams, logicParams, ...rest }) => {
  const { setPageLoading, extraSaveParams } = extraLogicParams;

  const { layout } = logicParams || {};

  const { code } = extraSaveParams || {};

  if (layout === 'tabs') {
    const tabField = form.query('formLayout.*').take();

    if (tabField) {
      setPageLoading(true);
      const activeKey = tabField.invoke('activeKey');
      const tabs = tabField.invoke('tabs');
      getSubmitFormValues(
        form,
        `${tabField.address.concat(activeKey).toString()}.*`,
      )
        .then((formValues) => {
          setPageLoading(false);
          const sysParamInfoList = [];
          tabs.forEach((tab) => {
            const { fields } = tab;
            fields.forEach((field) => {
              const title = form.query(field).getIn('title');

              const key = dashToDot(field);

              const val = formValues[key];

              sysParamInfoList.push({
                key,
                typeCode: code,
                name: title,
                value: Array.isArray(val) ? JSON.stringify(val) : val,
                paramValue: tab.key,
              });
            });
          });

          sysParamInfo(sysParamInfoList, setPageLoading);
        })
        .catch(() => {
          setPageLoading(false);
        });
    }
  } else {
    getSubmitFormValues(form)
      .then((formValues) => {
        setPageLoading(false);
        const sysParamInfoList = [];
        Object.keys(formValues).forEach((key) => {
          const title = form.query(dotToDash(key)).getIn('title');
          const val = formValues[key];

          if (key === 'sys.security.password.char.type') {
            if (Array.isArray(val)) {
              const next = val.reduce((acc, cur) => {
                if (cur === 'upper') {
                  return `${acc}A-Z`;
                }
                if (cur === 'lower') {
                  return `${acc}a-z`;
                }
                if (cur === 'number') {
                  return `${acc}0-9`;
                }
                if (cur === 'symbol') {
                  return `${acc}/*._-`;
                }

                return `${acc}${cur}`;
              }, '');

              sysParamInfoList.push({
                key,
                typeCode: code,
                name: title,
                value: `[${next}]`,
              });
            } else {
              sysParamInfoList.push({
                key,
                typeCode: code,
                name: title,
                value: val,
              });
            }
          } else {
            sysParamInfoList.push({
              key,
              typeCode: code,
              name: title,
              value: Array.isArray(val) ? JSON.stringify(val) : val,
            });
          }
        });
        sysParamInfo(sysParamInfoList, setPageLoading);
      })
      .catch(() => {
        setPageLoading(false);
      });
  }
};

export default paramConfigSave;
