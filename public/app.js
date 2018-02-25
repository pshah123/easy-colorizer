let e = require('express')
a = e()
a.use(e.static('.'))
a.listen(80)