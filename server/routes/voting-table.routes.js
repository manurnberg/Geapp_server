const router = require('express').Router();
const auth = require('./auth');
const multer = require('multer');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

//file storage destination and file name. We will rename it later.
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        console.log("filepath-->>", config)
         cb(null, config.filepath); //./uploads/
    },
    filename: function(req, file, cb){
        console.log('file on backend-->', file)
        cb(null, file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    console.log('inside filFilter')
    if(file.mimetype === 'image/jpeg' 
    || file.mimetype === 'image/png'){
        //accept
        cb(null,true);
    }else {
        //reject
        const error = new Error('La imagen del escrutinio debe ser JPG o PNG.');
        error.status = 422;
        cb(error,false);
    }
};

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter,
    limits: {fileSize: 1024*1024*20, fieldNameSize: 50} //20Mb
}); 


const votingTableController = require('../controllers/voting-table.controller');

router.get('/', auth.required, votingTableController.getVotingTable);
router.post('/scrutiny/file/:tableNumber', auth.required, votingTableController.getScrutinyImage);
// router.get('/:nationalId', auth.required, votingTableController.getUserVotingTable);
router.put('/vote/:voterId', auth.required, votingTableController.vote);
router.put('/replenish/:qty', auth.required, votingTableController.replenish);
router.post('/scrutiny/file', auth.required, upload.single('scrutinyImage'), votingTableController.scrutinyImage);
router.post('/scrutiny', auth.required, votingTableController.scrutiny);
router.post('/scrutiny/sheet', auth.required, votingTableController.getScrutinyImage);

module.exports = router;