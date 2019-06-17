export class Register{
    public UID: string;
    public email: string;
    public firstName: string;
    public lastName: string;
    public country: string="United States";
    public DOB: string;
    public photoURL: string;
    public thumbnailURL: string;

    private monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    private dates = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
    getModel(){
        return {
            UID:this.UID,
            email:this.email,
            firstName:this.firstName,
            lastName:this.lastName,
            country:this.country,
            DOB:this.DOB
        };
    }

    getYear(){
        var items: number[] = [];
        for (var j = new Date().getFullYear(); j >= 1920; j--) {
        items.push(j);
        }
        return items;
    }
    getMonth(){
        return this.monthNames;
    }
    getDate(){
        return this.dates;
    }

    getNumberMonth(monthStr){
        let num=this.monthNames.indexOf(monthStr)+1;
        //monthNames.indexOf(monthStr);
        if(this.monthNames.indexOf(monthStr)<9){
            return "0"+num;
        }else{
            return ""+num;
        }
    }

    setAfterLoginData(data){
        var gettingdateofBirth = data.Birthdate.split("-");
        return {
            AccountId :data.AccountId,
            IntacctID__c :data.IntacctID__c,
            FirstName :data.FirstName,
            LastName :data.LastName,
            Email :data.Email,
            Birthdate :data.Birthdate,
            MobilePhone :data.MobilePhone,
            HomePhone :data.HomePhone,
            WorkPhone :data.WorkPhone,
            BillingStreet_1 :data.BillingStreet_1,
            BillingStreet_2 :data.BillingStreet_2,
            BillingStreet_3 :data.BillingStreet_3,
            BillingCity :data.BillingCity,
            BillingState :data.BillingState,
            BillingPostalCode :data.BillingPostalCode,
            BillingCountry :data.BillingCountry,
            ShippingStreet_1 :data.ShippingStreet_1,
            ShippingStreet_2 :data.ShippingStreet_2,
            ShippingStreet_3 :data.ShippingStreet_3,
            ShippingCity :data.ShippingCity,
            ShippingState :data.ShippingState,
            ShippingPostalCode :data.ShippingPostalCode,
            ShippingCountry :data.ShippingCountry,
            year :gettingdateofBirth[0],
            month :gettingdateofBirth[1],
            date :gettingdateofBirth[2]
        }
    }

}