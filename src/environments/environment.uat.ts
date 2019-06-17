export const environment = {
  production: true,
  app_url:"http://uat.my.awana.org",
  api_url:"http://uat.my.awana.org:4200/api/",
  img_url:"http://uat.my.awana.org:4200/uploads/",
  sf_url:"https://cs70.salesforce.com/services/data/v29.0/query?q=",
  gigya_url:"https://accounts.us1.gigya.com/",
  gigya_key:"3_JlEDfrZ6mKX52eOdVcMaN84ZBqguUg7Pa5IKMOnjsTxYPvqA6D3wqLXKYT3tdr_o",
  app_userkey:"APYRj5JUU3fH",
  app_secret:"wqg3wdl810oM5zbUvl9qz5YazAeyhPBj",
  woocommerce_path:"http://staging.store.awana.org/my-account/view-order/",
  awanaStore:"http://staging.store.awana.org/",

  /*Application Environment*/
   "environment"            : "development",

   /* Service Configuration */
   "services": {
       "user": {"url":"http://uat.my.awana.org:3000/", "port":3000},

       "order": {"url":"http://uat.my.awana.org:4000/", "port":4000},

       "church": {"url":"http://uat.my.awana.org:5000/", "port":5000},

       "leader": {"url":"http://uat.my.awana.org:6000/", "port":6000}
   }

};