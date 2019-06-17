
/**
 * Model to store the user autherization.
 * @author Siva Sanker Reddy on 29-March-2018.
 */

export class UserAuthorization {
   public authorizationLevel = null; //user to store the authorization level like Organization Owner, Authorized Purchaser, Normal User
   public editManagePrograms = false; // allows user to edit Manage Programs page based on user's access level/role.
   public viewManageLeaders = false; // allows user to view Manage Leaders page based on user's access level/role.
   public editManageLeaders = false;  // allows user to edit Manage Leaders page based on user's access level/role.
   public viewOrderHistory = false;   // allows user to view Order History page based on user's access level/role.
   public editChurchProfile  = false; // allows user to edit Church Profile page based on user's access level/role.
}
