import { Device, devices } from 'node-hid';
import fse from 'fs-extra';
import { EOL } from 'os';
import MemoryMap from 'nrf-intel-hex';
import { Buffer, LogService, UHK_DEVICES, UhkDeviceProduct } from 'uhk-common';

import { Constants, UsbCommand } from './constants.js';
import isOsProvideUsbInterface from './utils/is-os-provide-usb-interface.js';

export const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Convert the Buffer to number[]
 * @param {Buffer} buffer
 * @returns {number[]}
 * @private
 * @static
 */
export function convertBufferToIntArray(buffer: Buffer): number[] {
    return Array.prototype.slice.call(buffer, 0);
}

/**
 * Split the communication package into 64 byte fragments
 * @param {UsbCommand} usbCommand
 * @param {Buffer} configBuffer
 * @returns {Buffer[]}
 * @private
 */
export function getTransferBuffers(usbCommand: UsbCommand, configBuffer: Buffer): Buffer[] {
    const fragments: Buffer[] = [];
    const MAX_SENDING_PAYLOAD_SIZE = Constants.MAX_PAYLOAD_SIZE - 4;
    for (let offset = 0; offset < configBuffer.length; offset += MAX_SENDING_PAYLOAD_SIZE) {
        const length = offset + MAX_SENDING_PAYLOAD_SIZE < configBuffer.length
            ? MAX_SENDING_PAYLOAD_SIZE
            : configBuffer.length - offset;
        const header = Buffer.from([usbCommand, length, offset & 0xFF, offset >> 8]);
        fragments.push(Buffer.concat([header, configBuffer.slice(offset, offset + length)]));
    }

    return fragments;
}

/**
 * Create the communication package that will send over USB and
 * @param {Buffer} buffer
 * @returns {number[]}
 * @private
 * @static
 */
export function getTransferData(buffer: Buffer): number[] {
    const data = convertBufferToIntArray(buffer);
    data.unshift(0);

    return data;
}

/**
 * Convert buffer to space separated hexadecimal string
 * @param {Buffer} buffer
 * @returns {string}
 * @private
 * @static
 */
export function bufferToString(buffer: Array<number> | Buffer): string {
    let str = '';
    for (let i = 0; i < buffer.length; i++) {
        let hex = buffer[i].toString(16) + ' ';
        if (hex.length <= 2) {
            hex = '0' + hex;
        }
        str += hex;
    }
    return str;
}

export async function retry(command: Function, maxTry = 3, logService?: LogService): Promise<any> {
    let retryCount = 0;

    while (true) {
        try {
            // logService.debug(`[retry] try to run FUNCTION:\n ${command}, \n retry: ${retryCount}`);
            await command();
            // logService.debug(`[retry] success FUNCTION:\n ${command}, \n retry: ${retryCount}`);
            return;
        } catch (err) {
            retryCount++;
            if (retryCount >= maxTry) {

                if (logService) {
                    // logService.error(`[retry] failed and no try rerun FUNCTION:\n ${command}, \n retry: ${retryCount}`);
                }

                throw err;
            } else {
                if (logService) {
                    logService.misc(`[retry] failed, but try run FUNCTION:\n ${command}, \n retry: ${retryCount}`);
                }
                await snooze(100);
            }
        }
    }
}

export const isUhkZeroInterface = (dev: Device): boolean => {
    return UHK_DEVICES.some(device => dev.vendorId === device.vendorId &&
        dev.productId === device.keyboardPid &&
        ((dev.usagePage === 128 && dev.usage === 129) || // Old firmware
            (dev.usagePage === (0xFF00 | 0x00) && dev.usage === 0x01) || // New firmware
            (dev.interface === 0 && isOsProvideUsbInterface())
        )
    );
};

export const getUhkDevice = (dev: Device): UhkDeviceProduct => {
    return UHK_DEVICES.find(device => dev.vendorId === device.vendorId &&
        (dev.productId === device.keyboardPid || dev.productId === device.bootloaderPid)
    );
};

export const isBootloader = (dev: Device): boolean => {
    return UHK_DEVICES.some(device => dev.vendorId === device.vendorId && dev.productId === device.bootloaderPid);
};

export const getFileContentAsync = async (filePath: string): Promise<Array<string>> => {
    const fileContent = await fse.readFile(filePath, {encoding: 'utf-8'});

    return fileContent
        .split(EOL)
        .map(x => x.trim())
        .filter(x => !x.startsWith('#') && x.length > 0);
};

export const readBootloaderFirmwareFromHexFileAsync = async (hexFilePath: string): Promise<Map<any, any>> => {
    const fileContent = await fse.readFile(hexFilePath, { encoding: 'utf8' });

    const memoryMap = MemoryMap.fromHex(fileContent);

    return memoryMap;
};

export const waitForDevice = async (vendorId: number, productId: number): Promise<void> => {
    const startTime = new Date().getTime() + 15000;

    while (startTime > new Date().getTime()) {

        const isAvailable = devices()
            .some(dev => dev.vendorId === vendorId && dev.productId === productId);

        if (isAvailable) {
            await snooze(1000);

            return;
        }

        await snooze(250);
    }

    throw new Error(`Cannot find device with vendorId: ${vendorId}, productId: ${productId}`);
};
