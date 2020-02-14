const express = require('express');

const router = express.Router();

const projectDB = require('../data/helpers/projectModel');

// get all projects
router.get('/', (req, res) => {
  projectDB.get()
    .then(project => {
      res.status(200).json(project)
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error getting all projects', error })
    })
})

// get all actions by project id
router.get('/:id/actions', validateProjectID, (req, res) => {
  const id = req.params.id;

  projectDB.getProjectActions(id)
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error getting all actions by project id', error })
    })
})


// custom middleware
function validateProjectID(req, res, next) {
  const id = req.params.id;

  projectDB.get(id)
    .then(project => {
      if(project) {
        next()
      } else {
        res.status(404).json({ message: 'Could not locate that project! '})
      }
    })
};

function validateProject(req, res, next) {
  const body = req.body;
  const name = req.body.name;
  const description = req.body.description;

  if(Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Missing project data' })
  } else if(!name || !description) {
    res.status(400).json({ message: 'Missing required name or description' })
  }
  next();
}

module.exports = router;
