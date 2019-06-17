export const environment = {
  production: true,
  app_url:"http://dev1.my.awana.org",
  api_url:"http://dev1.my.awana.org:4200/api/",
  img_url:"http://dev1.my.awana.org:4200/uploads/",
  sf_url:"https://cs70.salesforce.com/services/data/v29.0/query?q=",
  gigya_url:"https://accounts.us1.gigya.com/",
  gigya_key:"3_dm5e59jM9AmGU1R8usqpGAI-xe_f2dgXMzZ-rn2EWkGsczLOKkhwj07JOj78YFLx",
  app_userkey:"APYRj5JUU3fH",
  app_secret:"wqg3wdl810oM5zbUvl9qz5YazAeyhPBj",
  login_redirect: "http://dev1.my.awana.org/dashboard",
  woocommerce_path:"http://dev-awananetwork.pantheonsite.io/my-account/view-order/",
  awanaStore:"http://dev4.store.awana.org/", 
  

  /*Application Environment*/
   "environment"            : "development",

   /* Service Configuration */
   "services": {
       "user": {"url":"http://dev1.my.awana.org:3000/", "port":3000},

       "order": {"url":"http://dev1.my.awana.org:4000/", "port":4000},

       "church": {"url":"http://dev1.my.awana.org:5000/", "port":5000},

       "leader": {"url":"http://dev1.my.awana.org:6000/", "port":6000}
   }

};
