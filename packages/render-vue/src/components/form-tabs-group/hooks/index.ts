import { useField, useForm } from '@/formily-vue';

export const useTabs = (tabsSources) => {
  const tabsField = useField();

  const form = useForm();

  return tabsSources.reduce((tabs, cur) => {
    const { name, title, schema } = cur || {};

    const field = form.value.query(tabsField.value.address.concat(name)).take();

    if (field?.display !== 'visible') {
      return tabs;
    }

    return tabs.concat({
      name,
      title,
      key: `${name}`,
      schema,
    });
  }, []);
};
