export class PhoneNumberConverter {
  /**
   * Converts the entered number to USA format (###)-###-####. Ex. (910)-997-4908
   * @author Siva Sanker Reddy on 01-Feb-2018
   */
  convertPhoneNumberToUsaFormat(phoneNumber): string {

    phoneNumber = phoneNumber.replace(/[^0-9]*/g, ''); //removes all other charcters except the numbers.
    let number = String(phoneNumber);
    
    // Will return formattedNumber. 
    // If phonenumber isn't longer than an area code, just show number
    var formattedNumber = phoneNumber;

    // if the first character is '1', strip it out
    number = number[0] == '1' ? number.slice(1) : number;

    // +# ###-###-#### as c (area) front-end
    var area = number.substring(0, 3);
    var front = number.substring(3, 6);
    var end = number.substring(6, 10);

    if (front) {
      formattedNumber = ("(" + area + ") " + front);
    }
    if (end) {
      formattedNumber += ("-" + end);
    }
    return formattedNumber;
  }

}