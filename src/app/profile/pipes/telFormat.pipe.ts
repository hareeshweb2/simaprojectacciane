import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat' })
export class PhonePipe implements PipeTransform {
    transform(val, args) {
        if (!val) { return ''; }
        val = String(val);
        val = val.replace(/[^0-9]*/g, '');
        var formattedNumber = val;
        //var c = (val[0] == '1') ? '1' : '';
        // val = val[0] == '1' ? val.slice(1) : val;
        var first = val.substring(0, 3);
        var second = val.substring(3, 6);
        var third = val.substring(6, 10);
        if (second) {
            formattedNumber = ("(" + first + ")" + " " + second);
        }
        if (third) {
            formattedNumber += ("-" + third);
        }
        return formattedNumber;

    }
}