import prettyMilliseconds from "pretty-ms";

export function getReadableMillis(until: bigint, time: bigint) {
  if (until == BigInt(-1))
    return "Permanent";

  return prettyMilliseconds(Number(until) - Number(time), {verbose: true});
}

export function getReadableDate(time: bigint): string {
  let date: Date = new Date(Number(time));
  return date.toLocaleString();
}