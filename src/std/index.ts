import { Address } from '../codecs/core';
import { HRP } from '../hrp';
import {
  SINGLE_SIG_TEMPLATE_ADDRESS,
  SINGLE_SIG_TEMPLATE_TESTNET_ADDRESS,
} from './singlesig';

export const STD_TEMPLATE_ADDRESSES: Record<HRP, Record<string, Address>> = {
  [HRP.MainNet]: {
    SingleSigAccount: SINGLE_SIG_TEMPLATE_ADDRESS,
  },
  [HRP.TestNet]: {
    SingleSigAccount: SINGLE_SIG_TEMPLATE_TESTNET_ADDRESS,
  },
};
