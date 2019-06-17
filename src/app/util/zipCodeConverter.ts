export class ZipCodeConverter {
  /**
   * Converts the entered number to USA format #####-####. Ex. 12345-6789
   * @author Siva Sanker Reddy on Women's day-2018
   */
  convertZipCodeToUsaFormat(zipCode): string {

    zipCode = zipCode.replace(/[^0-9]*/g, ''); //removes all other charcters except the numbers.
    let number = String(zipCode);

    var area = number.substring(0, 5);
    var end = number.substring(5, 9);

    var formattedCode = area;
    if (end) {
      formattedCode = (area + "-" + end);
    }
    return formattedCode;
  }
}