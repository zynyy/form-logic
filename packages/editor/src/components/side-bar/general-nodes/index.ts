import {Graph} from "@antv/x6";

import startNode from "./start";
import endNode from "./end";
import processNode from "./process";
import yesOrNoNode from "./yes-or-no";
import policyDecisionNode from "./policy-decision";
import dataNode from "./data";


const generalNodes = (graph: Graph) => {
  return [
    startNode,
    endNode,
    processNode,
    yesOrNoNode,
    policyDecisionNode,
    dataNode,
  ].map((fn) => {
    return fn(graph);
  });
};

export default generalNodes;
