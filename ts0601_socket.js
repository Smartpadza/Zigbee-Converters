const tuya = require('zigbee-herdsman-converters/lib/tuya');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;
const ea = exposes.access;

module.exports = {
    fingerprint: [{modelID: 'TS0601', manufacturerName: '_TZE200_dcrrztpa'}],
    model: 'TS0601_socket_2gang_usb',
    vendor: 'Tuya',
    description: '2-gang + USB PD smart socket with energy monitoring',

    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    configure: tuya.configureMagicPacket,

    exposes: [

        // Switches mapped to datapoints (NOT endpoints)
            e.switch().withEndpoint("Plugs"),
            e.switch().withEndpoint("USB"),
            e.switch().withDescription("All switches"),

        // Timers
        e.numeric('timer_socket', ea.STATE_SET).withUnit('s'),
        e.numeric('timer_usb', ea.STATE_SET).withUnit('s'),

        // Energy monitoring
        e.energy(),
        e.power(),
        e.current(),
        e.voltage(),

        // Other controls
        e.child_lock(),
        e.binary('backlight', ea.STATE_SET, 'ON', 'OFF'),
    ],

    meta: {
        multiEndpoint: true,
        tuyaDatapoints: [
            [1, "state_Plugs", tuya.valueConverter.onOff],
            [2, "state_USB", tuya.valueConverter.onOff],
            [136, 'state_all', tuya.valueConverter.onOff],
            [7, 'timer_socket', tuya.valueConverter.countdown],
            [8, 'timer_usb', tuya.valueConverter.countdown],

            [20, 'energy', tuya.valueConverter.divideBy100],
            [21, 'current', tuya.valueConverter.divideBy1000],
            [22, 'power', tuya.valueConverter.divideBy10],
            [23, 'voltage', tuya.valueConverter.divideBy10],

            [101, 'child_lock', tuya.valueConverter.lockUnlock],

            [16, 'backlight', tuya.valueConverter.onOff],
        ],
    },
};
