import { StavelyAPIDictationAgent } from './dictation/dictation-agent';
import { StavelyAPISequenceAgent } from './sequence/sequence-agent';

export const StavelyAPIExerciseAgent = {
  sequence: StavelyAPISequenceAgent,
  dictation: StavelyAPIDictationAgent,
};
