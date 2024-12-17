export const twoDP = (val) => {
  val = (val + "");
  const string = (val)?.includes("-") ? val?.replace("-", "") : val;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
  return (val.includes("-") ? "-" : "") + (formatter.format(string).includes("$") ? "" : "$") + formatter.format(string);
};