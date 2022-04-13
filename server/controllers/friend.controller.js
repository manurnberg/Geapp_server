const Friend = require('../models/friend');
const Citizen = require('../models/citizen');
const User = require('../models/user');
const friendController = {};



friendController.getFriends = async (req, res, next) =>{
    try{
        console.log(`Get Friends for userId: ${req.payload.id}`);

        const friends = await Friend.findAll({
            where:{"userId": req.payload.id},
            include:[Citizen]
        });
        friends.forEach(element => {
           console.log("friends", element.citizen.id);
        });
        
        res.json(friends);

    }catch(e){
        next(e);
    }
};



friendController.addFriend = async (req, res, next)=>{
    try{
        const nationalId = req.body.nationalId; // dni de friend agregado
        const userId = req.payload.id; // id del usuario que agrega al friend
        const user = await User.findOne({where:{"nationalId": req.body.nationalId}});


        console.log(`Add Friend: DNI:${nationalId} and userId:${userId}`);

        if(!nationalId || nationalId.trim()==''){
            const err = Error('DNI Obligatorio'); err.status=422;
            throw err;
            //return res.status(422).json({errors: {nationaId: "DNI obligatorio"}});
        }

        const citizen = await Citizen.findOne({where: {"nationalId":nationalId}});
        if(!citizen){
            const err = Error('No encontrado en padrón.'); err.status = 422;
            throw err;
        }

        // user.isFriend = true;
        
        let friend = await Friend.findOne({where: {"userId":userId, "nationalId": nationalId}});
        console.log("friend-->", friend)
        if(!friend){
            friend = new Friend(); 
            friend.phone = req.body.phone;
            friend.email = req.body.email;
            friend.userId = userId;
            friend.nationalId = citizen.nationalId;
           // friend.citizenId = citizen.id; 
           console.log('if not friend', friend)           
            await friend.save(); 
            if (user){
                user.isFriend = true;
                await user.save();
            }//it modifies the friend.
        }else{
            //console.log('Friend already exists.');
            const err = Error('Amigo existente.'); err.status = 422;
            throw err;
        }
        
        //call again to include citizen.
        friend = await Friend.findOne({
            where: {"userId": userId, "nationalId": citizen.nationalId},
            include:[Citizen]
        });
        // friend = await Friend.findOne({
        //     where: {"userId":userId, "citizenId":citizen.id},
        //     include:[Citizen]
        //     });

        //console.log(friend);
        res.json(friend);
        
    }catch(e){ 
        next(e);
    }
};

// friendController.addiosFriend = async (req, res, next)=>{
//     try{
//         const email = req.body.email;
//         const userId = req.payload.id;

//         console.log(`Add Friend: email:${email} and userId:${userId}`);

//         if(!email || email.trim()==''){
//             const err = Error('email Obligatorio'); err.status=422;
//             throw err;
//             //return res.status(422).json({errors: {nationaId: "DNI obligatorio"}});
//         }

//         // const citizen = await Citizen.findOne({where: {"nationalId":nationalId}});
//         // if(!citizen){
//         //     const err = Error('No encontrado en padrón.'); err.status = 422;
//         //     throw err;
//         // }
        
//         let friend = await Friend.findOne({where: {"userId":userId, "email":email}});
//         if(!friend){
//             friend = new Friend(); 
//             friend.phone = req.body.phone;
//             friend.email = req.body.email;
//             friend.name = req.body.name;
//             friend.last_name = req.body.last_name;
//             friend.userId = userId;
//             //friend.citizenId = citizen.id;            
//             await friend.save(); //it modifies the friend.
//         }else{
//             //console.log('Friend already exists.');
//             const err = Error('Amigo existente.'); err.status = 422;
//             throw err;
//         }
        
//         //call again to include citizen.
//         // friend = await Friend.findOne({
//         //     where: {"userId":userId, "citizenId":citizen.id},
//         //     include:[Citizen]
//         //     });

//         console.log(friend);
//         res.json(friend);
//     }catch(e){ 
//         next(e);
//     }
// };

friendController.deleteFriend = async (req, res, next)=>{
    try{
        const friendId = req.params.id;
        console.log(`Delete Friend: Friend Id:${friendId} and userId:${req.payload.id}`);

        const d = await Friend.destroy({where: {"id": friendId, "userId":req.payload.id}});
        
        res.json({message: 'Amigo eliminado'});
    }catch(e){
        next(e);
    }
};

module.exports = friendController;