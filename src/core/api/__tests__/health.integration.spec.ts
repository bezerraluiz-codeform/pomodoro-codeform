import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { fetchHealth } from '../health';
import { spawn, ChildProcess } from 'child_process';

/**
 * Teste de integração com Prism Mock Server
 *
 * Pré-requisito: @stoplight/prism-cli instalado
 * Este teste sobe um mock server e valida a integração do client HTTP
 */
describe('fetchHealth - Integração com Prism Mock', () => {
    let prismProcess: ChildProcess | null = null;
    const MOCK_URL = 'http://localhost:4010';
    const CONTRACT_PATH = '../../../../../sprints/contract/contract.yaml';

    beforeAll(async () => {
        // Subir Prism mock server
        prismProcess = spawn('npx', [
            '@stoplight/prism-cli',
            'mock',
            '-h',
            '0.0.0.0',
            '-p',
            '4010',
            CONTRACT_PATH,
        ]);

        // Aguardar servidor iniciar (3 segundos)
        await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    afterAll(() => {
        // Derrubar mock server
        if (prismProcess) {
            prismProcess.kill();
        }
    });

    it('deve buscar /health do mock e retornar payload válido', async () => {
        const health = await fetchHealth(MOCK_URL);

        expect(health.status).toBe('ok');
        expect(typeof health.timestamp).toBe('string');
        expect(health.timestamp.length).toBeGreaterThan(0);
    });

    it('deve retornar timestamp ISO 8601 válido', async () => {
        const health = await fetchHealth(MOCK_URL);

        // Validar que é uma data válida
        const date = new Date(health.timestamp);
        expect(date.getTime()).not.toBeNaN();

        // Validar formato ISO 8601
        expect(health.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('deve permitir conversão para serverTimestamp em milliseconds', async () => {
        const health = await fetchHealth(MOCK_URL);
        const { toHealthClock } = await import('../health');

        const clock = toHealthClock(health);

        expect(typeof clock.serverTimestamp).toBe('number');
        expect(clock.serverTimestamp).toBeGreaterThan(0);
        expect(clock.serverIsoTimestamp).toBe(health.timestamp);
    });
});
