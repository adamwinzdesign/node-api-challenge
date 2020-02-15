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

// post new project
router.post('/', validateProject, (req, res) => {
  const newProject = req.body;

  projectDB.insert(newProject)
    .then(project => {
      res.status(201).json(project)
    })
    .catch(error => {
      // the .catch has been commented out in order to avoid an error caused by sending multiple headers.  Error handling has been passed to the middleware.
      // res.status(404).json({ message: 'Server error posting a new project', error })
    })
})

// update project
router.put('/:id', validateProjectID, (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  projectDB.update(id, newData)
    .then(updatedProject => {
      res.status(200).json(updatedProject)
    })
    .catch(error => {
      res.status(500).json({ message: 'Server error updating project', error })
    })
})

// delete project
router.delete('/:id', validateProjectID, (req, res) => {
  const id = req.params.id;

  projectDB.remove(id)
    .then(project => {
      res.status(200).json({ message: 'Project deleted!', project })
    })
    .catch(error => {
      res.status(500).json({ message: 'Server error deleting project', error })
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
        res.status(404).json({ message: 'Could not locate that project!' })
      }
    })
};

function validateProject(req, res, next) {
  const body = req.body;
  const { name, description } = req.body;

  if(Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Missing project data' })
  } else if(!name || !description || name === '' || description === '') {
    res.status(400).json({ message: 'Missing required name or description' })
  } else if(name && description){
    next();
  }
}

module.exports = router;
