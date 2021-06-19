export default function convertIdToString(object) {
  if (!object || !object.id) {
    console.error('Invalid object --> ', object);
    throw new Error('Invalid Arguments passed ');
  }

  const stringifiedId = `${object.id}`;
  return {
    ...object,
    id: stringifiedId,
  };
}
