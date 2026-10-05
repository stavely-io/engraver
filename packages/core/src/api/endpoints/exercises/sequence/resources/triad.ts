import { get } from "@/api/stavely-http";
import { SequenceTriadRequest, SequenceTriadResponse } from "@/api/types/exercises/sequence.types";

const GET_TRIAD_API_PATH = "exercises/sequence/triad";

export async function getTriad(params: SequenceTriadRequest): Promise<SequenceTriadResponse> {
  return get<SequenceTriadResponse>(GET_TRIAD_API_PATH, params);
}
