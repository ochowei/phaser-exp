import { describe, it, expect } from 'vitest';
import { stages, getStageById } from '../data/stageData.js';

describe('stageData', () => {
    it('has 3 stages', () => {
        expect(stages).toHaveLength(3);
    });

    it('each stage has required fields', () => {
        for (const stage of stages) {
            expect(stage).toHaveProperty('id');
            expect(stage).toHaveProperty('nameKey');
            expect(stage).toHaveProperty('waves');
            expect(stage).toHaveProperty('boss');
            expect(stage.waves.length).toBeGreaterThan(0);
            expect(stage.boss).toHaveProperty('profileKey');
            expect(stage.boss).toHaveProperty('fireDelay');
            expect(stage.boss).toHaveProperty('attackPattern');
        }
    });

    it('each wave has enemies and restAfter', () => {
        for (const stage of stages) {
            for (const wave of stage.waves) {
                expect(wave).toHaveProperty('enemies');
                expect(wave.enemies.length).toBeGreaterThan(0);
                expect(wave).toHaveProperty('restAfter');
                for (const group of wave.enemies) {
                    expect(group).toHaveProperty('profileKey');
                    expect(group).toHaveProperty('count');
                    expect(group.count).toBeGreaterThan(0);
                    expect(group).toHaveProperty('interval');
                    expect(group.interval).toBeGreaterThan(0);
                }
            }
        }
    });

    it('stages have unique ids', () => {
        const ids = stages.map(s => s.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('wave count increases across stages', () => {
        expect(stages[0].waves.length).toBeLessThanOrEqual(stages[1].waves.length);
        expect(stages[1].waves.length).toBeLessThanOrEqual(stages[2].waves.length);
    });

    describe('getStageById()', () => {
        it('returns the correct stage for a valid id', () => {
            const stage = getStageById(1);
            expect(stage.id).toBe(1);
            expect(stage.nameKey).toBe('stage1Name');
        });

        it('returns undefined for an invalid id', () => {
            expect(getStageById(99)).toBeUndefined();
        });
    });
});
