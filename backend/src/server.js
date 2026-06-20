import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`Nexlance API running on port  ${env.port}`);
  });
});
