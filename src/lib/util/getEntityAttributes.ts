export const makeAttribute = (object: unknown) => {
  const instance = object;
  if (instance instanceof Object) {
    const memberVariables = Object.keys(instance).filter(
      (key: string) => key !== 'updatedAt' && key !== 'deletedAt',
    );
    return memberVariables;
  }

  return {};
};
