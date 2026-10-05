import { get } from "@/api/stavely-http";
import {
  SequenceIntervalRequest,
  SequenceIntervalResponse,
} from "@/api/types/exercises/sequence.types";

const GET_INTERVAL_API_PATH = "exercises/sequence/interval";

export async function getInterval(
  params: SequenceIntervalRequest,
): Promise<SequenceIntervalResponse> {
  return get<SequenceIntervalResponse>(GET_INTERVAL_API_PATH, params);
}
