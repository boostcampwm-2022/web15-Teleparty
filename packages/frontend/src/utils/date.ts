const getCurrentDateTimeFormat = () => {
  const current = new Date();
  const time = Intl.DateTimeFormat("ko-KR", {
    timeStyle: "medium",
    hourCycle: "h23",
  })
    .format(current)
    .replace(/:/g, "-");
  const date = Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  })
    .format(current)
    .replace(/\./g, "")
    .replace(/\s/g, "-");
  return `${date}_${time}`;
};

export { getCurrentDateTimeFormat };
