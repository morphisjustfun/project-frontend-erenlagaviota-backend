export const Normalize = (target: string) => {
  return target
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "")
    .toLowerCase();
};
