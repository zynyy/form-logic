import { mount } from '@vue/test-utils';

import ModalPageForm from '../ModalPageForm';

import metaSchema from './metaSchema';

describe('modal-page-form ', () => {
  let wrapper;
  let modalPageForm;

  beforeEach(() => {
    wrapper = mount(ModalPageForm, {
      props: {
        visible: true,
        options: {
          metaSchema,
          hasGroup: true,
        },
        getLogicConfig: () => {
          return Promise.resolve();
        },
        formConfig: {},
      },
    });


    modalPageForm = wrapper.getComponent(ModalPageForm);
  });

  test('gen snapshot', async () => {
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});
