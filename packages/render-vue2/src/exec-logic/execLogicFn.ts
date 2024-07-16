import { LogicArgs, LogicConfigFn } from '@/interface';

const execLogicFn = (logicCode: string, args: LogicArgs, getLogicConfig?: LogicConfigFn) => {
  const execLogic = getLogicConfig?.(logicCode);
  if (execLogic) {
    execLogic?.(args);
  } else {
    console.error(`无法找到 ${logicCode} 逻辑请检查`);
    args.callback();
  }
};

export default execLogicFn;
