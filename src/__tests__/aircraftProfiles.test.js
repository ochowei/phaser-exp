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
                expect.arrayContaining(['S63HP', 'EN_RED', 'EN_PURPLE']),
            );
        });

        it.each(['S63HP', 'EN_RED', 'EN_PURPLE'])(
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
            expect(profile.name).toBe('S-63 Hornet Plus');
            expect(profile.textureKey).toBe('playerTexture');
        });

        it('returns the default profile when key is undefined', () => {
            const profile = getAircraftProfile(undefined);
            expect(profile.name).toBe('S-63 Hornet Plus');
        });

        it('returns the default profile for the DEFAULT_AIRCRAFT key', () => {
            const profile = getAircraftProfile(DEFAULT_AIRCRAFT);
            expect(profile).toBe(aircraftProfiles['S63HP']);
        });
    });

    describe('trail configuration', () => {
        it.each(['S63HP', 'EN_RED', 'EN_PURPLE'])(
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
