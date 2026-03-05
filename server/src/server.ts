import app from './app';
import config from './config';

const { port, nodeEnv } = config;

app.listen(port, () => {
  console.log('──────────────────────────────────────────');
  console.log(`  AI Dungeon Master Assistant — Server`);
  console.log(`  Environment : ${nodeEnv}`);
  console.log(`  Listening   : http://localhost:${port}`);
  console.log(`  Health      : http://localhost:${port}/health`);
  console.log('──────────────────────────────────────────');
});
