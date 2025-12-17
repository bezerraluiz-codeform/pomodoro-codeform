import { describe, it, expect } from '@jest/globals';
import {
  parseHealthResponse,
  toHealthClock,
  type HealthResponse,
} from '../health';

describe('parseHealthResponse', () => {
  it('deve parsear um payload válido de /health', () => {
    const payload = {
      status: 'ok',
      timestamp: '2025-12-17T10:00:00.000Z',
    };

    const result = parseHealthResponse(payload);

    expect(result).toEqual({
      status: 'ok',
      timestamp: '2025-12-17T10:00:00.000Z',
    });
  });

  it('deve rejeitar payload com status diferente de "ok"', () => {
    const payload = {
      status: 'error',
      timestamp: '2025-12-17T10:00:00.000Z',
    };

    expect(() => parseHealthResponse(payload)).toThrow(
      'Resposta inválida do /health'
    );
  });

  it('deve rejeitar payload sem timestamp', () => {
    const payload = {
      status: 'ok',
      timestamp: '',
    };

    expect(() => parseHealthResponse(payload)).toThrow(
      'Resposta inválida do /health'
    );
  });

  it('deve rejeitar payload quando timestamp não é string', () => {
    const payload = {
      status: 'ok',
      timestamp: 123456,
    };

    expect(() => parseHealthResponse(payload)).toThrow(
      'Resposta inválida do /health'
    );
  });

  it('deve rejeitar payload que não é um objeto', () => {
    expect(() => parseHealthResponse(null)).toThrow(
      'Resposta inválida do /health'
    );
    expect(() => parseHealthResponse('invalid')).toThrow(
      'Resposta inválida do /health'
    );
    expect(() => parseHealthResponse(123)).toThrow(
      'Resposta inválida do /health'
    );
  });

  it('deve fazer trim do timestamp', () => {
    const payload = {
      status: 'ok',
      timestamp: '  2025-12-17T10:00:00.000Z  ',
    };

    const result = parseHealthResponse(payload);

    expect(result.timestamp).toBe('2025-12-17T10:00:00.000Z');
  });
});

describe('toHealthClock', () => {
  it('deve converter timestamp ISO válido para milliseconds', () => {
    const health: HealthResponse = {
      status: 'ok',
      timestamp: '2025-12-17T10:00:00.000Z',
    };

    const clock = toHealthClock(health);

    expect(clock.serverTimestamp).toBe(
      new Date('2025-12-17T10:00:00.000Z').getTime()
    );
    expect(clock.serverIsoTimestamp).toBe('2025-12-17T10:00:00.000Z');
  });

  it('deve rejeitar timestamp inválido', () => {
    const health: HealthResponse = {
      status: 'ok',
      timestamp: 'invalid-date',
    };

    expect(() => toHealthClock(health)).toThrow(
      'Timestamp inválido do /health'
    );
  });

  it('deve processar timestamp em diferentes fusos horários', () => {
    const health: HealthResponse = {
      status: 'ok',
      timestamp: '2025-12-17T13:30:00-03:00',
    };

    const clock = toHealthClock(health);

    // Este timestamp em -03:00 é equivalente a 16:30:00 UTC
    expect(clock.serverTimestamp).toBe(
      new Date('2025-12-17T16:30:00.000Z').getTime()
    );
  });
});
