import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name:'AppendCommaAndSpace'
})

export class AppendCommaAndSpacePipe implements PipeTransform{
    transform(value: string){
        return value + ', '; 
    }
}