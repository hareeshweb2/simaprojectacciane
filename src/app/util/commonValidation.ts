
/** 
 * This class will contain most frequently used validation.
 * @author Siva Sanker Reddy on 07-March-2018
*/
export class CommonValidations{
    
    /**
     * @function validates if the entered text is a vaild URL or not.
     * @author Siva Sanker Reddy on 07-March-2018
     */
    validateWebsite(textToBeValidated):boolean {
        let validUrlPattern = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;
        
        if (textToBeValidated !== '') {
            if (validUrlPattern.test(textToBeValidated)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
}