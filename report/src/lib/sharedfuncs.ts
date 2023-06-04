import prettyMilliseconds from "pretty-ms";
import type { ReportEvidence } from "./types";

export function getReadableMillis(until: bigint, time: bigint) {
  if (until == BigInt(-1))
    return "Permanent";

  return prettyMilliseconds(Number(until) - Number(time), {verbose: true});
}

export function getReadableDate(time: bigint): string {
  let date: Date = new Date(Number(time));
  return date.toLocaleString();
}

export function createLinkFromEvidence(evidence: ReportEvidence): string {
  if (evidence.type == "YOUTUBE") return "https://youtube.com/watch?v=" + evidence.data;
  else if (evidence.type == "IMGUR") return "https://imgur.com/a/" + evidence.data;
  else if (evidence.type == "STREAMABLE") return "https://streamable.com/" + evidence.data;
  else return "ERROR. Type of " + evidence.type + " with data " + evidence.data + ". Please report to an admin."; 
}

export function convertReportType(type: String): string {
  if (type == "CHAT") return "Muteable Offences";
  if (type == "BAN") return "Banable Offences";
  if (type == "JAIL") return "Jailable Offences";
  else return "";
}
