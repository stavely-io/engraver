import { ScoreDataDTO } from './dto-model-types';

export type MelodicDictationResponse = {
  prompt_data: ScoreDataDTO;
  answer_data: ScoreDataDTO;
  difficulty_level: number;
  measure_count: number;
  voice_count: number;
  created_at: string;
  title: string;
};

export type RandomMelodicDictationRequest = {
  difficulty_level: number[];
  measure_count: number[];
  voice_count: number[];
};
