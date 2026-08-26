import { describe, it, expect } from 'vitest';
import { Rest } from './rest';
import { Duration } from './duration';
import { BaseDuration } from '../types/base-duration.enum';
import { DotCount } from '../types/dot-count.enum';
import { RestDTO } from '@/lib/api/types/exercises/dto-model-types';

describe('Rest', () => {
  describe('constructor', () => {
    it('should create a Rest instance with a given duration', () => {
      const duration = new Duration(BaseDuration.WHOLE, DotCount.ZERO);
      const rest = new Rest(duration);

      expect(rest).toBeInstanceOf(Rest);
      expect(rest.duration).toBe(duration);
    });
  });

  describe('static fromDTO', () => {
    it('should create a Rest instance from a RestDTO', () => {
      const restDTO: RestDTO = {
        duration: { baseValue: BaseDuration.HALF, dotCount: DotCount.ONE },
        pitches: [],
      };

      const rest = Rest.fromDTO(restDTO);

      expect(rest).toBeInstanceOf(Rest);
      expect(rest.duration).toBeInstanceOf(Duration);
      expect(rest.duration.baseValue).toBe(BaseDuration.HALF);
      expect(rest.duration.dotCount).toBe(DotCount.ONE);
    });
  });
});
