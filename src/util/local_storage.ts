export const locStorage = (typeof localStorage !== 'undefined')
  ? localStorage
  : { getItem: (_key: string) => null }
