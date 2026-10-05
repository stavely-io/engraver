import { get } from "@/api/stavely-http";
import {
  MelodicDictationResponse,
  RandomMelodicDictationRequest,
} from "@/api/types/exercises/dictation.types";
const GET_MELODIC_DICTATION_API_PATH = "exercises/dictation/";

export async function getMelodicDictationByID(id: string): Promise<MelodicDictationResponse> {
  const path = GET_MELODIC_DICTATION_API_PATH + `${id}/`;
  return get<MelodicDictationResponse>(path);
}

export async function getAllMelodicDictations(): Promise<MelodicDictationResponse[]> {
  const path = GET_MELODIC_DICTATION_API_PATH;
  return get<MelodicDictationResponse[]>(path);
}

export async function getRandomMelodicDictation(
  params: RandomMelodicDictationRequest,
): Promise<MelodicDictationResponse> {
  const path = GET_MELODIC_DICTATION_API_PATH + "random/";
  return get<MelodicDictationResponse>(path, params);
}
