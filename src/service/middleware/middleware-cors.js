import cors from 'cors';

export default function middlewareCors (app, config) {
  app.use(cors(config));
}