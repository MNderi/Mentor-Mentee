const express=require('express');
router=express.Router();
upload=require('../controller/multer')
const controller= require('../controller/coachController')
const programController=require('../controller/programController')
const profileController=require('../controller/profileController')
const {login} = require('../auth/auth')
const {verify} = require('../auth/auth');
const {setUrl}=require('../auth/auth');
const { verifyToken, authenticateManager } = require('../auth/managerAuth');
const manager=require('../controller/manager');


router.get('/',controller.homePage) ;
router.get('/login',controller.loginPage);
router.post('/login', login, controller.handleLogin);
router.get('/signup',controller.signupPage);
router.post('/signup',controller.register);
router.get('/allPrograms', verify, controller.findAll);
router.get('/dashboard/mentees',controller.adminView);
router.post('/dashboard/mentees/:funame/delete',controller.deleteMentee);
router.post('/dashboard/mentees/:mail/update',controller.updateMentee);
router.post('/dashboard/mentees/create',controller.register);
router.post('/mentor/create', verify, programController.addProgram);
router.get('/mentor/tasks', verify, controller.mentorTasks);
router.get('/mentor', verify, programController.mentor);
router.get('/mentee/tasks', verify, controller.menteeTasks);
router.get('/dashboard/mentors', verifyToken, controller.mentorsDashboard);
router.get('/dashboard/programs',verifyToken, programController.ProgramsDashboard);
router.get('/mentee/profile', verify, profileController.menteeProfile)
router.post('/mentee/profile/update', verify, upload.single('profilePicture'), profileController.menteeProfileUpdate)
router.get('/mentor/profile', verify, profileController.mentorProfile)
router.post('/mentor/profile/update', verify, upload.single('profilePicture'), profileController.mentorProfileUpdate)
router.post('/dashboard/mentors/:mail/delete',verifyToken,controller.deleteMentor);
router.post('/dashboard/mentors/:mail/update',verifyToken,controller.updateMentor);
router.post('/dashboard/mentors/create',verifyToken, controller.register);
router.post('/dashboard/programs/create',verifyToken, programController.addProgram);
router.post('/dashboard/programs/update',verifyToken, programController.updateProgram);
router.post('/dashboard/programs/:program/:creator/delete',verifyToken, programController.deleteProgram);
router.post('/specificProgram', verify, programController.specificProgram )
router.get("/logout", controller.logout);
router.get("/about", controller.about)
router.post("/mentee/enroll",verify, programController.enrollMentee)
router.post("/mentee/unenroll",verify, programController.unenrollMentee)
router.post("/specificProgram/mentor", verify, programController.specificProgramMentor)
router.post("/mentor/program/delete", verify, programController.deleteMyProgram)
router.post("/manager/login", authenticateManager, manager.handleManagerLogin)
router.get("/manager/login",manager.login )
router.patch('/programs/:id', verify, programController.patcher)
router.get('/mentor/allPrograms', verify, controller.mentorfindAll);
router.post('/mentor/edit/:program/:creator', verify, programController.mentorEditProgram)
router.get('/manager/logout', controller.managerLogout)
router.post('/mentee/add-goals', verify, profileController.addGoals);
router.post('/mentee/delete-goals', verify, profileController.deleteGoals);


// router.post('/upload-resource', upload.single('resource'), programController.uploadResources)
module.exports=router;