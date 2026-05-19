const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;

const colourLookup = tuya.valueConverterBasic.lookup({
    'red': 1,
    'blue': 2,
    'green': 3,
    'white': 4,
    'yellow': 5,
});

module.exports = {
    fingerprint: [{
        modelID: 'TS0601',
        manufacturerName: '_TZE284_zpvusbtv'
    }],
    model: 'jhy-wznh8_2g',
    vendor: 'Tuya',
    description: 'SmartPad 2-Gang Tactile Zigbee Wall Switch',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],   // Remove custom converter, rely on datapoints
    configure: tuya.configureMagicPacket,
    exposes: [
        e.switch(),
        e.binary('state_l2', ea.STATE_SET, 'ON', 'OFF'),
        exposes.binary('master_switch', ea.STATE_SET, 'ON', 'OFF')
            .withDescription('Master switch — turns all gangs on or off'),
        e.child_lock(),
        e.numeric('backlight', ea.STATE_SET)
            .withValueMin(1).withValueMax(100).withUnit('%')
            .withDescription('Backlight brightness (1–100)'),
        e.enum("on_colour", ea.STATE_SET, ["red", "blue", "green", "white", "yellow", "magenta", "cyan"]).withDescription("ON Colour"),
        e.enum("off_colour", ea.STATE_SET, ["red", "blue", "green", "white", "yellow", "magenta", "cyan"]).withDescription("OFF Colour"),
        e.enum('indicator_mode', ea.STATE_SET, ['relay', 'none', 'pos'])
            .withDescription('Indicator mode'),
        exposes.binary('off_colour_switch', ea.STATE_SET, 'ON', 'OFF')
            .withDescription('Enable or disable the indicator LED when switches are off'),
        e.enum('power_on_behavior', ea.STATE_SET, ['off', 'on', 'memory'])
            .withDescription('Behaviour after power restore (all gangs)'),
    ],
    meta: {
        tuyaDatapoints: [
            [1, 'state', tuya.valueConverter.onOff],   // Note: state_l1 instead of state
            [2, 'state_l2', tuya.valueConverter.onOff],
            [13, 'master_switch', tuya.valueConverter.onOff],
            [101, 'child_lock', tuya.valueConverter.onOff],
            [102, 'backlight', tuya.valueConverter.raw],
            [16, 'off_colour_switch', tuya.valueConverter.onOff],
            [
                103,
                "on_colour",
                tuya.valueConverterBasic.lookup({
                    red: tuya.enum(0),
                    blue: tuya.enum(1),
                    green: tuya.enum(2),
                    white: tuya.enum(3),
                    yellow: tuya.enum(4),
                    magenta: tuya.enum(5),
                    cyan: tuya.enum(6),
                }),
            ],
            [
                104,
                "off_colour",
                tuya.valueConverterBasic.lookup({
                    red: tuya.enum(0),
                    blue: tuya.enum(1),
                    green: tuya.enum(2),
                    white: tuya.enum(3),
                    yellow: tuya.enum(4),
                    magenta: tuya.enum(5),
                    cyan: tuya.enum(6),
                }),
            ],
            [15, 'indicator_mode', tuya.valueConverterBasic.lookup({
                'relay': 0, 'none': 1, 'pos': 2,
            })],
            [14, 'power_on_behavior', tuya.valueConverterBasic.lookup({
                'off': 0, 'on': 1, 'memory': 2,
            })],
        ],
    },

};