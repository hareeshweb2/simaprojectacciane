//This Pipe is to fix the Bug#335 of JIRA(https://jira.awana.org/browse/MYAW-335)

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'insertPeriod'
})

export class InsertPeiodInDateFormatPipe implements PipeTransform{
    transform(value: string){
        let prefix = value.substring(0, 3); //Fetch the name of the month.
        let suffix = value.substring(3, value.length); //Fetch the rest of the date
        return prefix + '.' + suffix; //Reconsturct the date with period(.) within the date and return.
    }
}