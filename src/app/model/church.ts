export class Church{

    public photoURL: string="assets/img/Church_Default_Img.png";
    public Type?:string;
    public role?:string;

    //chruch details
    public name: string;
    public accountID: string;
    public website: string;
    public size: string;
    public denomination: string;
    public phoneNumber: string;

    //billingAddress
    public billingStreet_1: string;
    public billingStreet_2: string;
    public billingStreet_3: string;
    public billingCity: string;
    public billingState: string;
    public billingPostalCode: string;
    public billingCountry: string;

    //shippingAddress
    public shippingStreet_1: string;
    public shippingStreet_2: string;
    public shippingStreet_3: string;
    public shippingCity: string;
    public shippingState: string;
    public shippingPostalCode: string;
    public shippingCountry: string;

    //physicalAddress
    public physicalStreet_1: string;
    public physicalStreet_2: string;
    public physicalStreet_3: string;
    public physicalCity: string;
    public physicalState: string;
    public physicalPostalCode: string;
    public physicalCountry: string;

    //mailingAddress
    public mailingStreet_1: string;
    public mailingStreet_2: string;
    public mailingStreet_3: string;
    public mailingCity: string;
    public mailingState: string;
    public mailingPostalCode: string;
    public mailingCountry: string;

    //User Authorization level for a specific church
    public authorizationLevel: string;
    public organizationOwner: string;
    public authorizedPurchaser: string;
    
    public registrationLevel: string;

    constructor(){}

    getChurch() {
        return this;
    }

    setChurch(church:any) {
    }
}