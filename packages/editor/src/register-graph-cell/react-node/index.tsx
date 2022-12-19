import { register } from "@antv/x6-react-shape";

import ModelPage from "./model-page";
import PageElement from "./page-element";
import ElementEvent from "./element-event";
import EventProcess from "./event-process";

const registerReactNode = () => {
  register({
    shape: "model-page-select-art-table",
    component: ModelPage,
  });

  register({
    shape: "page-element-select",
    component: PageElement,
  });

  register({
    shape: "element-event-select",
    component: ElementEvent,
  });

  register({
    shape: "event-process-select",
    component: EventProcess,
  });
};

export default registerReactNode;
