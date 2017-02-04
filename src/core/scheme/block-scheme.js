import {
    TOGGLE,
    FIXED,
    CLOCKWISE
} from '../../consts/rotate-type';

export default {
    I: {
        relPoints: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ],
        size: { cols: 4, rows: 1 },
        color: '#f5415c',
        rotateType: TOGGLE,
        point: { x: -2, y: 0 },
    },

    L: {
        relPoints: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
        ],
        size: { cols: 3, rows: 2 },
        color: '#fd7b2d',
        rotateType: CLOCKWISE,
        point: { x: -1, y: 0 },
    },

    S: {
        relPoints: [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
        ],
        size: { cols: 3, rows: 2 },
        color: '#c59fb4',
        rotateType: CLOCKWISE,
        point: { x: -1, y: 0 },
    },

    O: {
        relPoints: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ],
        size: { cols: 2, rows: 2 },
        color: '#0c63f1',
        rotateType: FIXED,
        point: { x: -1, y: 0 },
    },

    J: {
        relPoints: [
            { x: -1, y: -1 },
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
        ],
        size: { cols: 3, rows: 2 },
        color: '#fedf6b',
        rotateType: CLOCKWISE,
        point: { x: -1, y: 0 },
    },

    Z: {
        relPoints: [
            { x: 0, y: 0 },
            { x: 0, y: -1 },
            { x: -1, y: -1 },
            { x: 1, y: 0 },
        ],
        size: { cols: 3, rows: 2 },
        color: '#74ac55',
        rotateType: TOGGLE,
        point: { x: -1, y: 0 },
    },

    T: {
        relPoints: [
            { x: 0, y: 0 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ],
        size: { cols: 3, rows: 2 },
        color: '#802282',
        rotateType: CLOCKWISE,
        point: { x: -1, y: 0 },
    }
};
