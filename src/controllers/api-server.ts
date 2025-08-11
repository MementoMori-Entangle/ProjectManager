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

// dataフォルダのjson一覧取得
app.get('/api/project-files', projectController.getProjectFiles);
// jsonファイル新規作成
app.post('/api/project-files', projectController.createProjectFile);
// 選択中ファイル取得・変更
app.get('/api/selected-file', projectController.getSelectedFile);
app.post('/api/selected-file', projectController.setSelectedFile);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
