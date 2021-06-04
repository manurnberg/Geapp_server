
https://expressjs.com/es/advanced/best-practice-performance.html#try-catch
Backend
----------------------------------------------------------------------------------
npm init --yes                              //Create package.json
npm install express                         //BE Framewrok
npm install nodemon -D                      //Server Hot restart. (for dev only)
npm install morgan                          //Logger.
npm install express-jwt                     //middleware for validating jwt for auth.
npm install jsonwebtoken                    //generation jwt used by authentication
npm install passport                        //handling user authentication.
npm install slug                            //encoding titles into url-friendly format.
npm install -g sequelize-cli                //ORM (not mongoose)
npm install sequelize                       //ORM 
npm install --save mysql2                   //mysql driver
npm install --save multer                   //upload files.
npm install dateformat                      
to remove dependencies: npm remove nodemon

RUN SERVER (wo/nodemon): node server/app.js
RUN SERVER (nodemon): npm run dev

Mongo-JWT Example: https://github.com/gothinkster/node-express-realworld-example-app/blob/master/app.js
Aggregation Mongo: https://medium.com/@paulrohan/aggregation-in-mongodb-8195c8624337
Votes App - Pusher - CanvasJS: https://www.youtube.com/watch?v=MZ6wMonyVyY
Multer (files upload and download): https://www.youtube.com/watch?v=srPXMt1Q0nY

SEQUELIZE (because we have installed the cli.):
sequelize init                              //to init config.
sequelize model:create --name User --attributes nationalId:string //generate model

FRONT END
------------------------------------------------------------------------
Front End https://www.youtube.com/watch?v=Fdf5aTYRW0E&t=1225s
Dynamic routing: https://www.learnhowtoprogram.com/javascript/angular-extended/dynamic-routing-navigation
Front End - JWT: https://www.youtube.com/watch?v=BCygvtZwkh4
Front End - JWT parte2 authorization: https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3
Front End - JWT parte2 otro Authorization: https://jasonwatmore.com/post/2018/11/22/angular-7-role-based-authorization-tutorial-with-example
-----------
npm install -g @angular/cli                     //Create project using Angular cli
ng --version
ng new frontend                                 //To create a new /frontend folder w/ Angular cli.
RUN FE (standalone): cd fronend/ => ng serve    //localhost:4200 by default.

cd /src/app/components && ng g c employees      //ng generate component employees in that folder. (components)
ng g class models/employee                      //ng generate class employee (model)
cd /src/app/services && ng g s employee         //ng generate service employee (services)

ng build                                        //creates a dist folder to deploy to the server.
ng build --prod                                 //replaces `environment.ts` with `environment.prod.ts`.
npm audit                                       //to see vulnerabilities.

To solve CORS: cd /mean-crud && npm install cors    //2 servers comunicating.

Angular Prod files: https://medium.com/@balramchavan/configure-and-build-angular-application-for-different-environments-7e94a3c0af23 
Angular Material: https://www.youtube.com/watch?v=wPT3K3w6JtU
Angular Http Interceptors and Error: https://scotch.io/bar-talk/error-handling-with-angular-6-tips-and-best-practices192
npm i --save @angular/cdk @angular/material  @angular/animations hammerjs          //dependencies for ang material

Deploy Angular
----------------
Dev build vs Prod build: https://www.youtube.com/watch?v=GfeUrQ-xQN4
MEAN Deploy: https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli

AUTH EN ANGULAR 2
------------------
npm install --save @auth0/angular-jwt           //to use jwthelper.
npm install --save jwt-decode
ng g c login
ng g s auth
ng g i jwt-response
ng g i user
ng g m auth 				//better to create a new module for auth.
ng g s auth-guard
ng g s role-guard

material.angular.io
material.io/design
https://material.io/resources/icons/?style=baseline

VOLVER AL MATERIAL ICONS: 4.39s
https://www.youtube.com/watch?v=ZGWOc37kQkw&t=68s



*/