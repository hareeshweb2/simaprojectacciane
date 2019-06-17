//custom pipe for sorting by church name
import { Pipe } from '@angular/core';
@Pipe({ name: 'sortByChurchName' })
export class SortChurchPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a[args] < b[args]) {
        return -1;
      } else if (a[args] > b[args]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
