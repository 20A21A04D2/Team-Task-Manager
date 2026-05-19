const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addTaskComment
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(
    [
      body('title').notEmpty().withMessage('Task title is required'),
      body('projectId').notEmpty().withMessage('Project ID is required'),
    ],
    validate,
    createTask
  );

router.route('/:id')
  .get(getTaskById)
  .put(
    [
      body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
    ],
    validate,
    updateTask
  )
  .delete(deleteTask);

router.post('/:id/comments',
  [
    body('content').notEmpty().withMessage('Comment content cannot be empty'),
  ],
  validate,
  addTaskComment
);

module.exports = router;
