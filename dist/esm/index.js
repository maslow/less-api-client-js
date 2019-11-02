import { Cloud } from './cloud';
function init(config) {
    return new Cloud(config);
}
export { init, Cloud };
