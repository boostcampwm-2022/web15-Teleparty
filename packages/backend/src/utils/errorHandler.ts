export const errHandler = (
  target: any,
  key: string,
  desc: PropertyDescriptor
) => {
  desc.enumerable = true;
  const method = desc.value;

  desc.value = async function (...arg0: any) {
    try {
      await method(...arg0);
    } catch (err: any) {
      console.log(err.message);
    }
  };
};
