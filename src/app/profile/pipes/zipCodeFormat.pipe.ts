//  Custom Zip Code 
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'zipCodeFormat' })

export class ZipCodePipe implements PipeTransform {
    transform(zipValue:any, args:string) {
        if (!zipValue) { 
            return ''; 
        }
        zipValue = String(zipValue);
        zipValue = zipValue.replace(/[^0-9]*/g, '');
        let formattedZipCode = zipValue;
        let first = zipValue.substring(0, 5);
        let second = zipValue.substring(5, 9);
        
        if (second) {
            formattedZipCode = ( first + "-" + second);
        }
        return formattedZipCode;
    }
}