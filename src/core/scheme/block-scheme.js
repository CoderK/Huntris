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
        color: '#C23031',
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
        color: '#D59430',
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
        color: '#D59430',
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
        color: '#5EDBDF',
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
        color: '#FCC63F',
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
        color: '#40C77B',
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
        color: '#A325FB',
        rotateType: CLOCKWISE,
        point: { x: -1, y: 0 },
    }
};
