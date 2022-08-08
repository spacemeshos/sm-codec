import TemplateRegistry from '../registry';
import SingleSigTemplate from './singlesig';

const registerDefaultTemplates = () => {
  TemplateRegistry.register(SingleSigTemplate);
};

export default registerDefaultTemplates;
