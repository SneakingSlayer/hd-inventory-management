const router = require("express").Router();

router.get('/:id', async (req,res) => {
    res.redirect('https://www.youtube.com/watch?v=TtASKYcPfkc&ab_channel=lj40d')
})

module.exports = router;