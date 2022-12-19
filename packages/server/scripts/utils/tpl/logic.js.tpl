import loader from './loader';


const getLogicConfig = async (logicCode) => {

    if (loader[logicCode]) {

    return await loader[logicCode]?.()

    }
}

export default getLogicConfig;
