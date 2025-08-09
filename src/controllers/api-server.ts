const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const projectController = require('./projectController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// APIルーティング
app.get('/api/projects', projectController.getProjects);
app.post('/api/projects', projectController.addProject);
app.put('/api/projects/:id', projectController.updateProject);
app.delete('/api/projects/:id', projectController.deleteProject);
//app.post('/api/projects/:id/use', projectController.recordUse);
app.post('/api/projects/:id/copy', projectController.incrementCopyCount);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
