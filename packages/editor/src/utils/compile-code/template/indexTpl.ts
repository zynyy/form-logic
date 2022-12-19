
const generateTpl = () => {

    return `
import dsl from './dsl.json';
import nodeFns from './nodeFns';

const logicOptionConfig = {
    dsl,
    nodeFns
}

export default logicOptionConfig
`;
}

export default generateTpl
