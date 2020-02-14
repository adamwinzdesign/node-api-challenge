const express = require('express');

const router = express.Router();

const actionDB = require('../data/helpers/actionModel');

// get all actions
router.get('/', (req, res) => {
  actionDB.get()
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error getting all actions', error })
    })
})

// get action by action id
router.get('/:id', vaidateActionID, (req, res) => {
  actionDB.get(req.params.id)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Server error getting action by ID', error })
    })
})

// post a new action to an existing project

function vaidateActionID(req, res, next) {
  actionDB.get(req.params.id)
    .then(action => {
      if(action) {
        next()
      } else {
        res.status(404).json({ message: 'The action with that ID could not be found or does not exist' })
      }
    })
}

function validateAction(req, res, next) {
  // const body = req.body;
  // const desc = req.body.description;
  // const notes = req.body.notes;
  // const project_id = req.body.project_id;

  const { body, desc, notes, project_id } = req.body

  if(Object.keys(body).length === 0) {
    res.status(400).json({ message: 'Missing action data' })
  } else if(!desc || !notes || !project_id ) {
    res.status(400).json({ message: 'Missing required description, notes, or project_id' })
  } else if(desc.length > 128) {
    res.status(400).json({ message: 'Description cannot be longer than 128 characters!' })
  } else {
    actionDB.get(project_id)
      .then(project => {
        if(!project) {
          res.status(404).json({ message: 'Project with that ID could not be found' })
        }
        next();
      })
  }
}

module.exports = router;