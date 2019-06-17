import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'trimval'})
export class TrimPipe implements PipeTransform {
    transform(val) {
      if (!val) {
          return '';
        }
        return val.trim();
    }
}
