import { get } from "@/api/stavely-http";
import { SequenceFourChordRequest, SequenceFourChordResponse } from "@/api/types";

const GET_FOUR_CHORD_API_PATH = "exercises/sequence/four_chord";

export async function getFourChord(
  params: SequenceFourChordRequest,
): Promise<SequenceFourChordResponse> {
  return get<SequenceFourChordResponse>(GET_FOUR_CHORD_API_PATH, params);
}
