import SingleSigTemplate from './singlesig';

export const StdTemplates = {
  [SingleSigTemplate.key]: SingleSigTemplate,
};

export const StdPublicKeys = {
  SingleSig: SingleSigTemplate.key,
};
