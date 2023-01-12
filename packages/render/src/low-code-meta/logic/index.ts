import loader from './loader';

const getLogicConfig = async (logicCode) => {

  if (loader[logicCode]) {
    return await loader[logicCode]?.();
  } else {
    console.error(`无法找到 ${logicCode} 逻辑`);
  }
};

export default getLogicConfig;
