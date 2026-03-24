import { describe, it, expect } from 'vitest';
import aircraftProfiles, {
    DEFAULT_AIRCRAFT,
    getAircraftProfile,
} from '../profiles/aircraftProfiles.js';

describe('aircraftProfiles', () => {
    describe('DEFAULT_AIRCRAFT', () => {
        it('is set to "S63HP"', () => {
            expect(DEFAULT_AIRCRAFT).toBe('S63HP');
        });
    });

    describe('profile data', () => {
        it('contains the expected profile keys', () => {
            expect(Object.keys(aircraftProfiles)).toEqual(
                expect.arrayContaining([
                    'S63HP', 'EN_RED', 'EN_PURPLE', 'EN_BOSS_GREEN',
                    'EN_BOSS_STAGE1', 'EN_BOSS_STAGE2', 'EN_BOSS_STAGE3',
                ]),
            );
        });

        it.each(['S63HP', 'EN_RED', 'EN_PURPLE', 'EN_BOSS_GREEN', 'EN_BOSS_STAGE1', 'EN_BOSS_STAGE2', 'EN_BOSS_STAGE3'])(
            '%s has required fields',
            (key) => {
                const profile = aircraftProfiles[key];
                expect(profile).toHaveProperty('name');
                expect(profile).toHaveProperty('textureKey');
                expect(profile).toHaveProperty('textureSize');
                expect(profile.textureSize).toHaveProperty('width');
                expect(profile.textureSize).toHaveProperty('height');
                expect(profile).toHaveProperty('draw');
                expect(typeof profile.draw).toBe('function');
                expect(profile).toHaveProperty('trail');
                expect(profile).toHaveProperty('trailOffset');
            },
        );
    });

    describe('getAircraftProfile()', () => {
        it('returns the correct profile for a valid key', () => {
            const profile = getAircraftProfile('EN_RED');
            expect(profile.name).toBe('R-71 Crimson');
            expect(profile.textureKey).toBe('enemy_normal');
        });

        it('returns the default profile for an unknown key', () => {
            const profile = getAircraftProfile('NONEXISTENT');
            expect(profile.name).toBe('R-82 Ironwing');
            expect(profile.textureKey).toBe('playerTexture');
        });

        it('returns the default profile when key is undefined', () => {
            const profile = getAircraftProfile(undefined);
            expect(profile.name).toBe('R-82 Ironwing');
        });

        it('returns the default profile for the DEFAULT_AIRCRAFT key', () => {
            const profile = getAircraftProfile(DEFAULT_AIRCRAFT);
            expect(profile).toBe(aircraftProfiles['S63HP']);
        });
    });

    describe('boss profile', () => {
        it('EN_BOSS_GREEN has larger texture size', () => {
            const profile = aircraftProfiles['EN_BOSS_GREEN'];
            expect(profile.textureSize.width).toBeGreaterThan(32);
            expect(profile.textureSize.height).toBeGreaterThan(32);
        });
    });

    describe('enemy hp values', () => {
        it('each enemy profile has an hp property', () => {
            expect(aircraftProfiles['EN_RED'].hp).toBe(1);
            expect(aircraftProfiles['EN_PURPLE'].hp).toBe(3);
            expect(aircraftProfiles['EN_BOSS_GREEN'].hp).toBe(10);
        });

        it('enemy hp values are in ascending order by threat level', () => {
            const red = aircraftProfiles['EN_RED'].hp;
            const purple = aircraftProfiles['EN_PURPLE'].hp;
            const boss = aircraftProfiles['EN_BOSS_GREEN'].hp;
            expect(red).toBeLessThan(purple);
            expect(purple).toBeLessThan(boss);
        });
    });

    describe('stage boss profiles', () => {
        it.each(['EN_BOSS_STAGE1', 'EN_BOSS_STAGE2', 'EN_BOSS_STAGE3'])(
            '%s has 48x48 texture size',
            (key) => {
                const profile = aircraftProfiles[key];
                expect(profile.textureSize.width).toBe(48);
                expect(profile.textureSize.height).toBe(48);
            },
        );

        it.each(['EN_BOSS_STAGE1', 'EN_BOSS_STAGE2', 'EN_BOSS_STAGE3'])(
            '%s has an attackPattern',
            (key) => {
                const profile = aircraftProfiles[key];
                expect(['aimed', 'scatter', 'tracking']).toContain(profile.attackPattern);
            },
        );

        it('stage boss hp values increase across stages', () => {
            const s1 = aircraftProfiles['EN_BOSS_STAGE1'].hp;
            const s2 = aircraftProfiles['EN_BOSS_STAGE2'].hp;
            const s3 = aircraftProfiles['EN_BOSS_STAGE3'].hp;
            expect(s1).toBeLessThan(s2);
            expect(s2).toBeLessThan(s3);
        });
    });

    describe('trail configuration', () => {
        it.each(['S63HP', 'EN_RED', 'EN_PURPLE', 'EN_BOSS_GREEN', 'EN_BOSS_STAGE1', 'EN_BOSS_STAGE2', 'EN_BOSS_STAGE3'])(
            '%s has valid trail settings',
            (key) => {
                const { trail } = aircraftProfiles[key];
                expect(trail.speed).toHaveProperty('min');
                expect(trail.speed).toHaveProperty('max');
                expect(trail.speed.min).toBeLessThan(trail.speed.max);
                expect(trail.lifespan).toBeGreaterThan(0);
                expect(trail.tint).toBeInstanceOf(Array);
                expect(trail.tint.length).toBeGreaterThan(0);
                expect(trail.blendMode).toBe('ADD');
            },
        );
    });
});
