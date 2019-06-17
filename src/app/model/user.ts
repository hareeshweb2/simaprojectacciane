export class User {
    //gigya
    public UID: string;
    public ContactId?: string;
    public photoURL: string = "assets/img/Default_Profile_Img.png";
    public thumbnailURL: string = "assets/img/Default_Profile_Img.png";

    //SF Fields
    public AccountId: string;
    public Email: string;
    public FirstName: string;
    public LastName: string;
    public MobilePhone: string;

    //creating new sf fields as per new requirements
    public IntacctID__c: string;
    public HomePhone: string;
    public WorkPhone: string;
    public BillingStreet_1: string;
    public BillingStreet_2: string;
    public BillingStreet_3: string;
    public BillingCity: string;
    public BillingState: string;
    public BillingPostalCode: string;
    public BillingCountry: string;
    public ShippingStreet_1: string;
    public ShippingStreet_2: string;
    public ShippingStreet_3: string;
    public ShippingCity: string;
    public ShippingState: string;
    public ShippingPostalCode: string;
    public ShippingCountry: string;
    public Birthdate: string;
    public date: string;
    public month: string;
    public year: string;
    constructor() {

    }

    getUser() {
        return this;
    }
}
