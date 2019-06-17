import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'insertCommaAndSpace'
})

/**
 * Return the same value, appended with comma and a space.
 * @author Siva Sanker Reddy on 02-Mar-2018
 */
export class InsertCommaAndSpacePipe implements PipeTransform{
    transform(value: string){
        return value + ', '; 
    }
}