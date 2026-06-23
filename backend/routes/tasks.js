'use strict';
const router = require('express').Router({ mergeParams: true });
const auth   = require('../middleware/auth');
const c      = require('../controllers/taskController');

router.use(auth);
router.get('/',    c.getAll);
router.get('/:id', c.getOne);
router.post('/',   c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
