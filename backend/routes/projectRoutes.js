const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(
    [
      body('name').notEmpty().withMessage('Project name is required'),
    ],
    validate,
    createProject
  );

router.route('/:id')
  .get(getProjectById)
  .put(
    [
      body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    ],
    validate,
    updateProject
  )
  .delete(deleteProject);

router.post('/:id/members',
  [
    body('email').isEmail().withMessage('Please enter a valid member email'),
  ],
  validate,
  addProjectMember
);

router.delete('/:id/members/:userId', removeProjectMember);

module.exports = router;
