import { dataTemplateCode } from '@/components/side-bar/general-nodes/data/dataTemplateCode';
import { endTemplateCode } from '@/components/side-bar/general-nodes/end/endTemplateCode';
import { startTemplateCode } from '@/components/side-bar/general-nodes/start/startTemplateCode';
import { policyDecisionTemplateCode } from '@/components/side-bar/general-nodes/policy-decision/policyDecisionTemplateCode';
import { processTemplateCode } from '@/components/side-bar/general-nodes/process/processTemplateCode';
import { yesOrNoTemplate } from '@/components/side-bar/general-nodes/yes-or-no/yesOrNoTemplate';

type GenCode = () => string;

class TemplateCodes {
  private templateCodes: Map<string, GenCode> = new Map();

  constructor() {
    this.use('startTemplateCode', startTemplateCode)
      .use('endTemplateCode', endTemplateCode)
      .use('dataTemplateCode', dataTemplateCode)
      .use('policyDecisionTemplateCode', policyDecisionTemplateCode)
      .use('processTemplateCode', processTemplateCode)
      .use('yesOrNoTemplate', yesOrNoTemplate)
  }

  use(templateCode: string, genCode: GenCode) {
    if (!this.templateCodes.has(templateCode)) {
      this.templateCodes.set(templateCode, genCode);
    }
    return this;
  }

  getCode(template: string) {
    const codeTemp = this.templateCodes.get(template);
    if (codeTemp) {
      return codeTemp();
    }
    return '';
  }
}

const templateCodes = new TemplateCodes();

export default templateCodes;
