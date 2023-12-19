const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Identity = require('../model/identityModel'); // Adjust the path as necessary
const Program=require('../model/programModel');
const { addProgram,enrollMentee,unenrollMentee, deleteMyProgram ,patcher, mentorEditProgram} = require('../controller/programController');

// const res = {
//   locals: { username: 'mock@Username' },
//   status: jest.fn().mockReturnThis(),
//   send: jest.fn(),
//   json: jest.fn(),
// };


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const { register,findAll, mentorfindAll,adminView,deleteMentee, updateMentee, menteeTasks,deleteMentor, handleLogin } = require('../controller/coachController');
const validator = require('validator');
const { mentorProfile, mentorProfileUpdate,addGoals ,deleteGoals}=require('../controller/profileController');

jest.mock('../model/identityModel');
jest.mock('../model/programModel');
jest.mock('validator');


// let req, res;

// beforeEach(() => {
//     req = { body: { mail: '', password: '' }};
//     res = { redirect: jest.fn(), send: jest.fn(), status: jest.fn().mockReturnThis() };
// });

// describe('handleLogin function', () => {
//     test('redirects to /mentee/profile for Mentee', async () => {
//         req.body.mail = 'mentee@example.com';
//         Identity.handleLogin.mockResolvedValue('Mentee');

//         await handleLogin(req, res);

//         expect(Identity.handleLogin).toHaveBeenCalledWith('mentee@example.com');
//         expect(res.redirect).toHaveBeenCalledWith('/mentee/profile');
//     });

//     test('redirects to /mentor/profile for Mentor', async () => {
//         req.body.mail = 'mentor@example.com';
//         Identity.handleLogin.mockResolvedValue('Mentor');

//         await handleLogin(req, res);

//         expect(Identity.handleLogin).toHaveBeenCalledWith('mentor@example.com');
//         expect(res.redirect).toHaveBeenCalledWith('/mentor/profile');
//     });

//     test('handles login error when user is not found', async () => {
//         req.body.mail = 'unknown@example.com';
//         Identity.handleLogin.mockRejectedValue(new Error('User not found'));

//         await handleLogin(req, res);

//         expect(Identity.handleLogin).toHaveBeenCalledWith('unknown@example.com');
//         expect(res.send).toHaveBeenCalledWith(expect.any(String));
//     });

// });

// describe('mentorEditProgram', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully update a program and related Identity documents', async () => {
//     const req = {
//       body: {
//         initialname: 'Old Program Name',
//         creator: 'Test Creator',
//         program: 'New Program Name',
//         date: '2021-01-01',
//         endDate: '2021-12-31',
//         venue: 'New Venue',
//         category: 'New Category'
//       }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Program.findOneAndUpdate.mockResolvedValue({ program: 'New Program Name' });
//     Identity.updateMany.mockResolvedValue({});

//     await mentorEditProgram(req, res);

//     expect(Program.findOneAndUpdate).toHaveBeenCalledWith(
//       { program: req.body.initialname, creator: req.body.creator },
//       { $set: { program: req.body.program, date: req.body.date, endDate: req.body.endDate, venue: req.body.venue, category: req.body.category } },
//       { new: true }
//     );
//     expect(Identity.updateMany).toHaveBeenCalledTimes(2);
//     expect(res.send).toHaveBeenCalledWith("We have updated Old Program Name");
//   });

//   it('should return 400 for invalid program name parameter', async () => {
//     const req = {
//       body: { creator: 'Test Creator' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     await mentorEditProgram(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith("Invalid Program name parameter.");
//   });

//   it('should handle program not found', async () => {
//     const req = {
//       body: {
//         initialname: 'Nonexistent Program',
//         creator: 'Test Creator'
//       }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Program.findOneAndUpdate.mockResolvedValue(null);

//     await mentorEditProgram(req, res);

//     expect(res.send).toHaveBeenCalledWith("Program not found.");
//   });

//   it('should handle errors during program update', async () => {
//     const req = {
//       body: {
//         initialname: 'Old Program Name',
//         creator: 'Test Creator'
//       }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Program.findOneAndUpdate.mockRejectedValue(new Error('Internal Error'));

//     await mentorEditProgram(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Error updating Program.");
//   });
// });

// describe('patcher', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully update program fields', async () => {
//     const req = {
//       params: { id: '12345' },
//       body: { goals: 'New Goals', skills: 'New Skills' }
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockProgram = { _id: '12345', goals: 'New Goals', skills: 'New Skills' };
//     Program.findByIdAndUpdate.mockResolvedValue(mockProgram);

//     await patcher(req, res);

//     expect(Program.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true, runValidators: true });
//     expect(res.send).toHaveBeenCalledWith(mockProgram);
//   });

//   it('should return 400 for invalid updates', async () => {
//     const req = {
//       params: { id: '12345' },
//       body: { invalidField: 'Invalid' }
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     await patcher(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith({ error: 'Invalid updates!' });
//   });

//   it('should handle program not found', async () => {
//     const req = {
//       params: { id: 'nonexistentId' },
//       body: { goals: 'New Goals' }
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Program.findByIdAndUpdate.mockResolvedValue(null);

//     await patcher(req, res);

//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalled();
//   });

//   it('should handle errors during update', async () => {
//     const req = {
//       params: { id: '12345' },
//       body: { goals: 'New Goals' }
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Program.findByIdAndUpdate.mockRejectedValue(new Error('Internal Error'));

//     await patcher(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalled();
//   });
// });


// describe('deleteMyProgram', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully delete a program', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Program.deleteOne.mockResolvedValue({ deletedCount: 1 });
//     Identity.updateOne.mockResolvedValue({});
//     Identity.updateMany.mockResolvedValue({});

//     await deleteMyProgram(req, res);

//     expect(Program.deleteOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(Identity.updateOne).toHaveBeenCalledWith(
//       { mail: res.locals.username, customRadio: "Mentor", 'created.program': req.body.program },
//       { $pull: { created: { program: req.body.program } } }
//     );
//     expect(Identity.updateMany).toHaveBeenCalledWith(
//       {},
//       { $pull: { enrolled: { program: req.body.program, creator: req.body.creator } } }
//     );
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith('Program deleted successfully');
//   });

//   it('should handle program not found', async () => {
//     const req = {
//       body: { program: 'Nonexistent Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Program.deleteOne.mockResolvedValue({ deletedCount: 0 });

//     await deleteMyProgram(req, res);

//     expect(Program.deleteOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Program not found' });
//   });

//   it('should handle errors during program deletion', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Program.deleteOne.mockRejectedValue(new Error('Internal Error'));

//     await deleteMyProgram(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
//   });
// });


// describe('unenrollMentee', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully unenroll a user from a program', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockUser = {
//       enrolled: [{ program: 'Test Program', creator: 'Test Creator' }],
//       save: jest.fn().mockResolvedValue({})
//     };
//     const mockProgram = {
//       numberEnrolled: 1,
//       save: jest.fn().mockResolvedValue({})
//     };
//     Identity.findOne.mockResolvedValue(mockUser);
//     Program.findOne.mockResolvedValue(mockProgram);

//     await unenrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(Program.findOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(mockProgram.save).toHaveBeenCalled();
//     expect(mockUser.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith('Unenrollment successful');
//   });

//   it('should handle user not found', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'unknown@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockResolvedValue(null);

//     await unenrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith('User not found');
//   });

//   it('should handle user not enrolled in this program', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockUser = {
//       enrolled: [],
//       save: jest.fn()
//     };
//     Identity.findOne.mockResolvedValue(mockUser);

//     await unenrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith('User is not enrolled in this program');
//   });

//   it('should handle program not found', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockUser = {
//       enrolled: [{ program: 'Test Program', creator: 'Test Creator' }],
//       save: jest.fn()
//     };
//     Identity.findOne.mockResolvedValue(mockUser);
//     Program.findOne.mockResolvedValue(null);

//     await unenrollMentee(req, res);

//     expect(Program.findOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith('Program not found');
//   });

//   it('should handle errors during unenrollment', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockRejectedValue(new Error('Internal Error'));

//     await unenrollMentee(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });


// describe('enrollMentee', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should successfully enroll a user in a program', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockUser = {
//       enrolled: [],
//       save: jest.fn().mockResolvedValue({})
//     };
//     const mockProgram = {
//       numberEnrolled: 0,
//       save: jest.fn().mockResolvedValue({})
//     };
//     Identity.findOne.mockResolvedValue(mockUser);
//     Program.findOne.mockResolvedValue(mockProgram);

//     await enrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(Program.findOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(mockUser.enrolled.length).toBe(1);
//     expect(mockProgram.save).toHaveBeenCalled();
//     expect(mockUser.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith('Enrollment successful');
//   });

//   it('should handle user not found', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'nonexistent@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockResolvedValue(null);

//     await enrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith('User not found');
//   });

//   it('should handle user already enrolled', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockUser = {
//       enrolled: [{ program: 'Test Program', creator: 'Test Creator' }],
//       save: jest.fn()
//     };
//     Identity.findOne.mockResolvedValue(mockUser);

//     await enrollMentee(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith('User is already enrolled in this program');
//   });

//   it('should handle program not found', async () => {
//     const req = {
//       body: { program: 'Nonexistent Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };
  
//     // Mocking user found but program not found
//     const mockUser = { enrolled: [], save: jest.fn() };
//     Identity.findOne.mockResolvedValue(mockUser);
//     Program.findOne.mockResolvedValue(null);
  
//     await enrollMentee(req, res);
  
//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(Program.findOne).toHaveBeenCalledWith({ program: req.body.program, creator: req.body.creator });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith('Program not found');
//   });

//   it('should handle errors during enrollment', async () => {
//     const req = {
//       body: { program: 'Test Program', creator: 'Test Creator' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockRejectedValue(new Error('Internal Error'));

//     await enrollMentee(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });


// describe('addProgram', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear previous mocks
//   });

//   it('should successfully create a new program and update the mentor profile', async () => {
//     const req = {
//       body: {
//         program: 'New Program',
//         date: new Date(),
//         endDate: new Date(),
//         venue: 'New Venue',
//         description: 'Program Description',
//         category: 'Program Category',
//         creator: 'creator@example.com'
//       }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockProgram = { save: jest.fn().mockResolvedValue({}) };
//     Program.mockImplementation(() => mockProgram);
//     Identity.findOneAndUpdate.mockResolvedValue({});

//     await addProgram(req, res);

//     expect(mockProgram.save).toHaveBeenCalled();
//     expect(Identity.findOneAndUpdate).toHaveBeenCalledWith(
//       { mail: res.locals.username, customRadio: "Mentor" },
//       { $push: { created: { program: req.body.program, creator: req.body.creator } } },
//       { new: true }
//     );
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.send).toHaveBeenCalledWith('Program created successfully');
//   });

//   it('should handle errors during program creation', async () => {
//     const req = {
//       body: {
//         program: 'New Program',
//         date: new Date(),
//         endDate: new Date(),
//         venue: 'New Venue',
//         description: 'Program Description',
//         category: 'Program Category',
//         creator: 'creator@example.com'
//       }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     const mockProgram = { save: jest.fn().mockRejectedValue(new Error('Creation Error')) };
//     Program.mockImplementation(() => mockProgram);

//     await addProgram(req, res);

//     expect(mockProgram.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });




// describe('deleteGoals', () => {
//   it('should successfully delete specific goals from a mentee', async () => {
//     // Mocking request and response objects
//     const req = {
//       body: { deleteGoals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     // Mock the Identity.findOne method and mentee's save method
//     const mockMentee = {
//       save: jest.fn().mockResolvedValue({}),
//       goals: ['Goal1', 'Goal2', 'Goal3']
//     };
//     Identity.findOne.mockResolvedValue(mockMentee);

//     // Call the deleteGoals function
//     await deleteGoals(req, res);

//     // Assertions
//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(mockMentee.goals).toEqual(['Goal3']);
//     expect(mockMentee.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Goals deleted successfully', mentee: mockMentee });
//   });

//   it('should handle mentee not found', async () => {
//     const req = {
//       body: { deleteGoals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'nonexistent@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Identity.findOne.mockResolvedValue(null);

//     await deleteGoals(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Mentee not found' });
//   });

//   it('should handle errors during goal deletion', async () => {
//     const req = {
//       body: { deleteGoals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Identity.findOne.mockRejectedValue(new Error('Internal Error'));

//     await deleteGoals(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
//   });
// });



// describe('addGoals', () => {
//   it('should successfully add goals to a mentee', async () => {
//     // Mocking request and response objects
//     const req = {
//       body: { goals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' }, // Correctly set the username
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     // Mock the Identity.findOne method and mentee's save method
//     const mockMentee = {
//       save: jest.fn().mockResolvedValue({}),
//       goals: []
//     };
//     Identity.findOne.mockResolvedValue(mockMentee);

//     // Call the addGoals function
//     await addGoals(req, res);

//     // Assertions
//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(mockMentee.goals).toEqual(req.body.goals);
//     expect(mockMentee.save).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ message: 'Goals added successfully', mentee: mockMentee });
//   });

//   it('should handle mentee not found', async () => {
//     const req = {
//       body: { goals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'nonexistent@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Identity.findOne.mockResolvedValue(null);

//     await addGoals(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Mentee not found' });
//   });

//   it('should handle errors during adding goals', async () => {
//     const req = {
//       body: { goals: ['Goal1', 'Goal2'] }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     };

//     Identity.findOne.mockRejectedValue(new Error('Internal Error'));

//     await addGoals(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username });
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
//   });
// });



// describe('mentorProfileUpdate', () => {
//   it('should successfully update the mentor profile', async () => {
//     // Mocking request and response objects
//     const req = {
//       locals: { username: 'mentor@example.com' },
//       body: {
//         funame: 'Updated Name',
//         about: 'Updated About',
//         occupation: 'Updated Occupation'
//       },
//       file: { filename: 'profilepic.jpg' }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Mock the Identity.updateUserProfile method
//     Identity.updateUserProfile.mockResolvedValue({ /* Mocked updated user data */ });

//     // Call the mentorProfileUpdate function
//     await mentorProfileUpdate(req, res);

//     // Assertions
//     expect(Identity.updateUserProfile).toHaveBeenCalledWith(
//       req.locals.username, 
//       "Mentor", 
//       {
//         funame: req.body.funame,
//         'profile.about': req.body.about,
//         'profile.occupation': req.body.occupation,
//         'profile.profilePicture': `/public/uploads/${req.file.filename}`
//       }
//     );
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.send).toHaveBeenCalledWith('Profile updated successfully');
//   });

//   it('should handle errors during profile update', async () => {
//     // Mocking request and response objects
//     const req = {
//       locals: { username: 'mentor@example.com' },
//       body: {
//         funame: 'Updated Name',
//         about: 'Updated About',
//         occupation: 'Updated Occupation'
//       },
//       file: { filename: 'profilepic.jpg' }
//     };
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Mock the Identity.updateUserProfile method to throw an error
//     Identity.updateUserProfile.mockRejectedValue(new Error('Update Error'));

//     // Call the mentorProfileUpdate function
//     await mentorProfileUpdate(req, res);

//     // Assertions for error handling
//     expect(Identity.updateUserProfile).toHaveBeenCalledWith(
//       req.locals.username, 
//       "Mentor", 
//       {
//         funame: req.body.funame,
//         'profile.about': req.body.about,
//         'profile.occupation': req.body.occupation,
//         'profile.profilePicture': `/public/uploads/${req.file.filename}`
//       }
//     );
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });



// describe('deleteMentor', () => {
//   it('should successfully delete a mentor and their programs', async () => {
//     // Mocking request and response objects
//     const req = {
//       params: { mail: 'mentor@example.com' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     // Mock the Identity.deleteMentor method
//     Identity.deleteMentor.mockResolvedValue();

//     // Call the deleteMentor function
//     await deleteMentor(req, res);

//     // Assertions
//     expect(Identity.deleteMentor).toHaveBeenCalledWith('mentor@example.com');
//     expect(res.send).toHaveBeenCalledWith("Mentor mentor@example.com and their programs have been successfully removed.");
//   });

//   it('should return an error for invalid email parameter', async () => {
//     const req = {
//       params: { mail: '' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     await deleteMentor(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith("Invalid name parameter.");
//   });

//   it('should handle errors during deletion', async () => {
//     const req = {
//       params: { mail: 'mentor@example.com' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Identity.deleteMentor.mockRejectedValue(new Error('Internal Error'));

//     await deleteMentor(req, res);

//     expect(Identity.deleteMentor).toHaveBeenCalledWith('mentor@example.com');
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Error!!");
//   });
// });


// describe('mentorProfile', () => {
//   it('should retrieve the mentor profile and render the page', async () => {
//     // Mocking response object
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Mock data for the mentor profile
//     const mockMentor = {
//       mail: 'mentor@example.com',
//       funame: 'Mentor Name',
//       // other profile details
//     };

//     // Mock the Identity.fetchUserProfile method
//     Identity.fetchUserProfile.mockResolvedValue(mockMentor);

//     // Call the mentorProfile function
//     await mentorProfile(null, res);

//     // Assertions
//     expect(Identity.fetchUserProfile).toHaveBeenCalledWith(res.locals.username, 'Mentor');
//     expect(res.render).toHaveBeenCalledWith('mentorProfile', { identity: mockMentor });
//   });

//   it('should handle errors', async () => {
//     // Mocking response object
//     const res = {
//       locals: { username: 'mentor@example.com' },
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Mock the Identity.fetchUserProfile method to throw an error
//     Identity.fetchUserProfile.mockRejectedValue(new Error('Internal Error'));

//     // Call the mentorProfile function
//     await mentorProfile(null, res);

//     // Assertions for error handling
//     expect(Identity.fetchUserProfile).toHaveBeenCalledWith(res.locals.username, 'Mentor');
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });


// describe('menteeTasks', () => {
//   it('should retrieve enrolled programs and render the tasks page', async () => {
//     // Mocking request and response objects
//     const req = {
//       params: { mail: 'mentee@example.com' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Mock data for the user and enrolled programs
//     const mockUser = {
//       enrolled: [{ program: 'Program1', creator: 'Creator1' }],
//       goals: 'Sample Goals'
//     };
//     const mockProgramDetails = [{ program: 'Program1', creator: 'Creator1', details: 'Details' }];

//     // Mock the Identity.findOne and Program.find methods
//     Identity.findOne.mockResolvedValue(mockUser);
//     Program.find.mockResolvedValue(mockProgramDetails);

//     // Call the menteeTasks function
//     await menteeTasks(req, res);

//     // Assertions
//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(Program.find).toHaveBeenCalled();
//     expect(res.render).toHaveBeenCalledWith('tasks', { myPrograms: mockProgramDetails, goals: mockUser.goals });
//   });

//   it('should handle user not found', async () => {
//     const req = {
//       params: { mail: 'nonexistent@example.com' }
//     };
//     const res = {
//       locals: { username: 'nonexistent@example.com' },
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockResolvedValue(null);

//     await menteeTasks(req, res);

//     expect(Identity.findOne).toHaveBeenCalledWith({ mail: res.locals.username, customRadio: "Mentee" });
//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.send).toHaveBeenCalledWith('User not found');
//   });

//   it('should handle errors', async () => {
//     const req = {
//       params: { mail: 'mentee@example.com' }
//     };
//     const res = {
//       locals: { username: 'mentee@example.com' },
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     Identity.findOne.mockRejectedValue(new Error('Internal Error'));

//     await menteeTasks(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });



// describe('updateMentee', () => {
//   it('should successfully update a mentee', async () => {
//     // Mocking request and response objects
//     const req = {
//       params: { mail: 'mentee@example.com' },
//       body: { /* update data */ }
//     };
//     const res = {
//       send: jest.fn()
//     };

//     // Mock the Identity.updateUserDetails method
//     Identity.updateUserDetails.mockResolvedValue({
//       funame: 'Updated Mentee',
//       /* other updated fields */
//     });

//     // Call the updateMentee function
//     await updateMentee(req, res);

//     // Assertions
//     expect(Identity.updateUserDetails).toHaveBeenCalledWith('mentee@example.com', req.body);
//     expect(res.send).toHaveBeenCalledWith("We have updated Updated Mentee");
//   });

//   it('should handle errors', async () => {
//     // Mocking request and response objects
//     const req = {
//       params: { mail: 'mentee@example.com' },
//       body: { /* update data */ }
//     };
//     const res = {
//       send: jest.fn()
//     };

//     // Mock the Identity.updateUserDetails method to throw an error
//     Identity.updateUserDetails.mockRejectedValue(new Error('Update Error'));

//     // Call the updateMentee function
//     await updateMentee(req, res);

//     // Assertions for error handling
//     expect(Identity.updateUserDetails).toHaveBeenCalledWith('mentee@example.com', req.body);
//     expect(res.send).toHaveBeenCalledWith("Error updating Mentee.");
//   });
// });


// describe('deleteMentee', () => {
//   it('should successfully delete a mentee', async () => {
//     // Mocking request and response objects
//     const req = {
//       params: { funame: 'MenteeName' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     // Mock the Identity.deleteOne method
//     Identity.deleteOne.mockResolvedValue({ deletedCount: 1 });

//     // Call the deleteMentee function
//     await deleteMentee(req, res);

//     // Assertions
//     expect(Identity.deleteOne).toHaveBeenCalledWith({ funame: 'MenteeName', customRadio: 'Mentee' });
//     expect(res.send).toHaveBeenCalledWith("We have removed MenteeName");
//   });

//   it('should return an error for invalid name parameter', async () => {
//     const req = {
//       params: { funame: '' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     await deleteMentee(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith("Invalid name parameter.");
//   });

//   it('should handle mentee not found', async () => {
//     const req = {
//       params: { funame: 'NonExistentMentee' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Identity.deleteOne.mockResolvedValue({ deletedCount: 0 });

//     await deleteMentee(req, res);

//     expect(Identity.deleteOne).toHaveBeenCalledWith({ funame: 'NonExistentMentee', customRadio: 'Mentee' });
//     expect(res.send).toHaveBeenCalledWith("Mentee not found.");
//   });

//   it('should handle errors during deletion', async () => {
//     const req = {
//       params: { funame: 'MenteeName' }
//     };
//     const res = {
//       send: jest.fn(),
//       status: jest.fn().mockReturnThis()
//     };

//     Identity.deleteOne.mockRejectedValue(new Error('Internal Error'));
//     await deleteMentee(req, res);

//     expect(Identity.deleteOne).toHaveBeenCalledWith({ funame: 'MenteeName', customRadio: 'Mentee' });
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith("Internal Server Error"); 
//    });
// });




// describe('adminView', () => {
//   it('should retrieve mentees and render the admin dashboard', async () => {
//     // Mock data for the mentees
//     const mockMentees = [
//       { funame: 'Mentee 1', mail: 'mentee1@example.com', customRadio: 'Mentee',},
//       { funame: 'Mentee 2', mail: 'mentee2@example.com', customRadio: 'Mentee',}
//       // Add more mock mentee data as needed
//     ];

//     // Mock the Identity.find method
//     Identity.find.mockResolvedValue(mockMentees);

//     // Mock the Express response object
//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the adminView function
//     await adminView(null, res);

//     // Assertions
//     expect(Identity.find).toHaveBeenCalledWith({ customRadio: 'Mentee' });
//     expect(res.render).toHaveBeenCalledWith('admindashboard', { users: mockMentees });
//   });

//   it('should handle errors', async () => {
//     // Mock the Identity.find method to throw an error
//     Identity.find.mockRejectedValue(new Error('Internal Server Error'));

//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the adminView function
//     await adminView(null, res);

//     // Assertions for error handling
//     expect(Identity.find).toHaveBeenCalledWith({ customRadio: 'Mentee' });
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });



// describe('mentorfindAll', () => {
//   it('should retrieve all programs and render the mentor page', async () => {
//     // Mock data for the programs
//     const mockPrograms = [
//       { program: 'Program 1', date: new Date(), endDate: new Date(), venue: 'Venue 1', description: 'Desc 1', category: 'Category 1', creator: 'Creator 1', numberEnrolled: 10, goals: 'Goals 1', skills: 'Skills 1', projection: 'Projection 1' },
//       { program: 'Program 2', date: new Date(), endDate: new Date(), venue: 'Venue 2', description: 'Desc 2', category: 'Category 2', creator: 'Creator 2', numberEnrolled: 20, goals: 'Goals 2', skills: 'Skills 2', projection: 'Projection 2' }
//       // Add more mock programs as needed
//     ];

//     // Mock the Program.find method
//     Program.find.mockResolvedValue(mockPrograms);

//     // Mock the Express response object
//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the mentorfindAll function
//     await mentorfindAll(null, res);

//     // Assertions
//     expect(Program.find).toHaveBeenCalled();
//     expect(res.render).toHaveBeenCalledWith('mentorfindAll', { programs: mockPrograms });
//   });

//   it('should handle errors', async () => {
//     // Mock the Program.find method to throw an error
//     Program.find.mockRejectedValue(new Error('Internal Server Error'));

//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the mentorfindAll function
//     await mentorfindAll(null, res);

//     // Assertions for error handling
//     expect(Program.find).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });


// describe('findAll', () => {
//   it('should retrieve all programs and render the page', async () => {
//     // Mock data for the programs that matches your schema
//     const mockPrograms = [
//       {
//         program: 'Program 1',
//         date: new Date('2021-01-01'),
//         endDate: new Date('2021-06-01'),
//         venue: 'Venue 1',
//         description: 'Description 1',
//         category: 'Category 1',
//         creator: 'Creator 1',
//         numberEnrolled: 10,
//         goals: 'Goals 1',
//         skills: 'Skills 1',
//         projection: 'Projection 1'
//       },
//       {
//         program: 'Program 2',
//         date: new Date('2021-07-01'),
//         endDate: new Date('2021-12-01'),
//         venue: 'Venue 2',
//         description: 'Description 2',
//         category: 'Category 2',
//         creator: 'Creator 2',
//         numberEnrolled: 15,
//         goals: 'Goals 2',
//         skills: 'Skills 2',
//         projection: 'Projection 2'
//       }
//       // Add more mock programs as needed
//     ];

//     // Mock the Program.find method
//     Program.find.mockResolvedValue(mockPrograms);

//     // Mock the Express response object
//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the findAll function
//     await findAll(null, res);

//     // Assertions
//     expect(Program.find).toHaveBeenCalled();
//     expect(res.render).toHaveBeenCalledWith('findAll', { programs: mockPrograms });
//   });

//   it('should handle errors', async () => {
//     // Mock the Program.find method to throw an error
//     Program.find.mockRejectedValue(new Error('Internal Server Error'));

//     const res = {
//       render: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn()
//     };

//     // Call the findAll function
//     await findAll(null, res);

//     // Assertions for error handling
//     expect(Program.find).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.send).toHaveBeenCalledWith('Internal Server Error');
//   });
// });

// describe('register', () => {
//   let req, res;

//   beforeEach(() => {
//     // Reset request and response objects
//     req = {
//       body: {
//         funame: 'John Doe',
//         mail: 'john@example.com',
//         password: 'password123',
//         confirmpassword: 'password123',
//         customRadio: 'Mentee'
//       }
//     };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       send: jest.fn(),
//       render: jest.fn()
//     };

//     // Reset mocks
//     Identity.registerNewUser.mockReset();

//     // Set default mock return values for validator functions
//     validator.isEmpty.mockReturnValue(false);
//     validator.isEmail.mockReturnValue(true);
//     validator.isLength.mockReturnValue(true);
//     validator.equals.mockReturnValue(true);
//     validator.isIn.mockReturnValue(true);
//   });

//   it('should return 400 if full name is empty', async () => {
//     req.body.funame = '';
//     validator.isEmpty.mockReturnValue(true);

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({error: "Full name is required."});
//   });

//   it('should return 400 for invalid email', async () => {
//     req.body.mail = 'invalid-email';
//     validator.isEmail.mockReturnValue(false);

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({error: "Invalid email address."});
//   });

//   it('should return 400 if password is less than 6 characters', async () => {
//     req.body.password = '123';
//     validator.isLength.mockReturnValue(false);

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({error: "Password must be at least 6 characters long."});
//   });

//   it('should return 400 if passwords do not match', async () => {
//     req.body.confirmpassword = 'different';
//     validator.equals.mockReturnValue(false);

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({error: "Passwords do not match."});
//   });

//   it('should return 400 for invalid role selection', async () => {
//     req.body.customRadio = 'InvalidRole';
//     validator.isIn.mockReturnValue(false);

//     await register(req, res);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({error: "Invalid role selection."});
//   });

//   it('should create a new identity successfully', async () => {
//     Identity.registerNewUser.mockResolvedValue({ funame: 'John Doe' });

//     await register(req, res);

//     expect(Identity.registerNewUser).toHaveBeenCalledWith(req.body);
//     expect(res.render).toHaveBeenCalledWith('registered', { name: 'John Doe' });
//   });
// });