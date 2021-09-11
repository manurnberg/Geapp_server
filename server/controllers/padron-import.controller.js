
const Citizen = require('../models/citizen');
const Voter = require('../models/voter');
const { forEach } = require('p-iteration');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
// const fs = require('graceful-fs');



// local json file consuming
const rawdata = fs.readFileSync('server/assets/padron.json');
const jsonFile = JSON.parse(rawdata);
console.log(jsonFile);

// string date to Date parsing
const parseDate = (string) => {

  const stringDate = `${string}-01-01`;
  return new Date(stringDate);

}

// load a citizen to DB and then a voter 
const citizenAndVoterUpload = async (jsonObject) => {

  console.log("array object-->", jsonObject);
  await forEach(jsonObject['response'], async (element) => {

    try {

      const birthday = parseDate(element.annio);
      console.log("date birthday-->", birthday);

      console.log("element dni-->", element.num_docu);

      const citizen = new Citizen();
      citizen.nationalId = element.num_docu;
      citizen.first = element.firstname;
      citizen.last = element.lastname;
      citizen.birthday = birthday;


      await citizen.save();

      const voterCitizen = await Citizen.findOne({
        where: { "nationalId": element.num_docu }

      })

      if (citizen) {
        try {

          console.log("direccion-->", element.direccion);

          const voter = new Voter();
          voter.order = element.num_orden;
          voter.citizenId = voterCitizen.id;
          voter.votingtableId = element.num_mesa;
          voter.address = element.direccion;

          console.log("voter direccion-->", voter.address);

          await voter.save()

        } catch (error) {

          console.log("ERROR!! ", error.message);

        }

      }

    } catch (error) {

      console.log("ERROR!! ", error.message);
    }

  });

}
// local file consuming
const citizendupload = citizenAndVoterUpload(jsonFile); 


// API consuming
// const apiRequest = () => {

//   const API_ENDPOINT = 'http://ec2-54-94-181-16.sa-east-1.compute.amazonaws.com:8080/coinpa/api/layers/type/pdf/only-read-fields'

//   const form_data = new FormData();
//   const binary = fs.createReadStream("/Users/matiasnumberg/Geapp_server/server/assets/07_CHUBUT_GENERALES_FISCAL_1UP_V01_Parte0-páginas-18297-18300.pdf");
//   form_data.append("file", binary);

//   console.log("file binary-->", fs.createReadStream("/Users/matiasnumberg/Geapp_server/server/assets/07_CHUBUT_GENERALES_FISCAL_1UP_V01_Parte0-páginas-18297-18300.pdf"))

//   const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiYXV0aG9yaXRpZXMiOlsiMDEiXX0.JoPTUTmvDpt4solG7tPHw_NFNiZdVbSszHPxPf4raLckqdy0q2HEOL3OIWnIra8dhbwbOLy8tlh7rSgzaoI3GQ';

//   axios.post(API_ENDPOINT,
//     form_data,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         "Authorization": `Bearer ${token}`
//       },
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity
//     }
//   )
//     .then(response => {
//       console.log(`statusCode: ${response.status}`);
//       console.log(response.message);
//       //const citizendupload = citizenAndVoterUpload(response['response']);
//     })
//     .catch(error => {
//       console.error(error.message);

//     })

// }

// apiRequest();















