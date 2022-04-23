const { Router } = require('express');
const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');

const router = Router();

router.get('/', userGet);
router.post('/', userPost);
router.put('/:id', userPut);
router.patch('/:id', userPatch);
router.delete('/:id', userDelete);

module.exports = router;