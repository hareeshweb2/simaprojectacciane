
import { User } from "./user";
import { Church } from "./church";

export class Currentprofile {
    public user:User;
    public church:Church;
    public selectedprofile:string = "user";
    public token:string;

    constructor(){
        this.user= new User();
        this.church = new Church();
    }
}
