export enum HRP {
  MainNet = 'sm',
  TestNet = 'stest',
}

export const deriveHrpFromAddress = (addr: string): HRP => {
  const head = addr.match(/^(\w+)1/)?.[1];
  if (!head) {
    throw new Error(`Can not derive HRP from Address: ${addr}`);
  }
  return head as HRP;
};
