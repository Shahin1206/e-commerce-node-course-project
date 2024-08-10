const getPageNotFound = (req,res,next) => {
    // res.status(404).send("Page Not Found");
    // res.status(404).sendFile(path.join(rootDir, 'views', 'page-not-found.html'), {pageTitle: '404 Error Page'});
    res.status(404).render('page-not-found', {pageTitle: '404 Error Page', path: null})
};

module.exports = {getPageNotFound}