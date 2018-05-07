import {TestBed, inject} from '@angular/core/testing';

import {AveragerService} from '../services/averager.service';

describe('AveragerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AveragerService]
        });
    });

    it('should be created', inject([AveragerService], (service: AveragerService) => {
        expect(service).toBeTruthy();
    }));

    it('should convert meter to yard', inject([AveragerService], (service: AveragerService) => {
        var output = service.convertDistance(1000, 'imperial');
        expect(output.value).toBe(1093.61);
        expect(output.unit).toBe('yd');
    }));

    it('should convert meter to mile', inject([AveragerService], (service: AveragerService) => {
        var output = service.convertDistance(10000, 'imperial');
        expect(output.value).toBe(6.21);
        expect(output.unit).toBe('mi');
    }));

    it('should convert meter to kilometer', inject([AveragerService], (service: AveragerService) => {
        var output = service.convertDistance(10000, 'metric');
        expect(output.value).toBe(10);
        expect(output.unit).toBe('km');
    }));

    it('should calculate averages from metric input', inject([AveragerService], (service: AveragerService) => {

        var input = {
            data: [
                {distance: 1000, distanceUnit: 1, time: 900},
                {distance: 2000, distanceUnit: 1, time: 1800},
                {distance: 1000, distanceUnit: 1, time: 900},
            ]
        };

        var output = service.getAverages(input, null);

        expect(output.runs).toBe(input.data.length);
        expect(output.totalDistance).toBe(4000);
        expect(output.totalDistanceMeters).toBe(4000);
        expect(output.totalDistanceUnit).toBe('m');
        expect(output.avgDistance).toBeCloseTo(1333.33, 1);
        expect(output.avgDistanceMeters).toBeCloseTo(1333.33, 1);
        expect(output.avgDistanceUnit).toBe('m');
        expect(output.topSpeed).toBeCloseTo(4, 1);
        expect(output.topSpeedMps).toBeCloseTo(1.11, 1);
        expect(output.topSpeedUnit).toBe('km/h');
        expect(output.avgSpeed).toBeCloseTo(4, 1);
        expect(output.avgSpeedMps).toBeCloseTo(1.11, 1);
        expect(output.avgSpeedUnit).toBe('km/h');
        expect(output.totalTime).toBe(3600);
        expect(output.avgTime).toBeCloseTo(1200, 1);
        expect(output.moonPercent).toBeCloseTo(0, 1);
        expect(output.system).toBe('metric');
    }));

    it('should calculate averages from imperial input', inject([AveragerService], (service: AveragerService) => {

        var input = {
            data: [
                {distance: 1000, distanceUnit: 0.9144, time: 900},
                {distance: 2000, distanceUnit: 0.9144, time: 1800},
                {distance: 1000, distanceUnit: 0.9144, time: 900},
            ]
        };

        var output = service.getAverages(input, null);

        expect(output.runs).toBe(input.data.length);
        expect(output.totalDistance).toBeCloseTo(4374.44, 1);
        expect(output.totalDistanceMeters).toBe(4000);
        expect(output.totalDistanceUnit).toBe('yd');
        expect(output.avgDistance).toBeCloseTo(1458.14, 1);
        expect(output.avgDistanceMeters).toBeCloseTo(1333.33, 1);
        expect(output.avgDistanceUnit).toBe('yd');
        expect(output.topSpeed).toBeCloseTo(2.49, 1);
        expect(output.topSpeedMps).toBeCloseTo(1.11, 1);
        expect(output.topSpeedUnit).toBe('mph');
        expect(output.avgSpeed).toBeCloseTo(2.49, 1);
        expect(output.avgSpeedMps).toBeCloseTo(1.11, 1);
        expect(output.avgSpeedUnit).toBe('mph');
        expect(output.totalTime).toBe(3600);
        expect(output.avgTime).toBeCloseTo(1200, 1);
        expect(output.moonPercent).toBeCloseTo(0, 1);
        expect(output.system).toBe('imperial');
    }));

    it('should compare two averages and supply correct percents', inject([AveragerService], (service: AveragerService) => {

        var previous = {
            runs: 100,
            totalDistanceMeters: 1000,
            avgDistanceMeters: 50,
            topSpeedMps: 100,
            avgSpeedMps: 120,
            totalTime: 400,
            avgTime: 500
        }

        var current = {
            runs: 50,
            totalDistanceMeters: 2000,
            avgDistanceMeters: 50,
            topSpeedMps: 120,
            avgSpeedMps: 100,
            totalTime: 500,
            avgTime: 400
        }

        var output = service.compareAverages(previous, current);

        expect(output.runs).toBe(-50);
        expect(output.totalDistanceMeters).toBe(100);
        expect(output.avgDistanceMeters).toBe(0);
        expect(output.topSpeedMps).toBe(20);
        expect(output.avgSpeedMps).toBe(-17);
        expect(output.totalTime).toBe(25);
        expect(output.avgTime).toBe(-20);

    }));
    
    it('should calculate a string timestamp from a number of seconds', inject([AveragerService], (service: AveragerService) => {
        
        var output = service.calculateTime(3600);
        expect(output['formatted']).toBe('01:00:00.000');

        var output = service.calculateTime(24*3600);
        expect(output['formatted']).toBe('1d 00:00:00.000');

        var output = service.calculateTime(70);
        expect(output['formatted']).toBe('00:01:10.000');

        var output = service.calculateTime(383.34);
        expect(output['formatted']).toBe('00:06:23.340');

    }));

    it('should convert UTC date to local date correctly', inject([AveragerService], (service: AveragerService) => {
        
        //  gets the current date, converts it to UTC, sends it to a string, expects original date to be returned
        
        var date = new Date();
        var utc = new Date(date.getUTCFullYear(), 
                                    date.getUTCMonth(),  
                                    date.getUTCDate(),  
                                    date.getUTCHours(),
                                    date.getUTCMinutes(),
                                    date.getUTCSeconds(),
                                    date.getUTCMilliseconds());
                                    
        var output = service.UTCDatetoDate(utc.toString());
        
        expect(output.toString()).toBe(date.toString());

    }));

    it('should format numbers correctly', inject([AveragerService], (service: AveragerService) => {
        
        var output = service.formatNumber(3600);
        expect(output).toBe('3,600');
        
        var output = service.formatNumber(364200.14);
        expect(output).toBe('364,200.14');
        
        var output = service.formatNumber(0);
        expect(output).toBe('0');
        
        var output = service.formatNumber(-12.30);
        expect(output).toBe('-12.3');
        
        var output = service.formatNumber('totally not a number');
        expect(output).toBe(false);

    }));

});
