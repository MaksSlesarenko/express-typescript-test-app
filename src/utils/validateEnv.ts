import { cleanEnv, port, str, url } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    NLU_A_ENDPOINT: url(),
    NLU_B_ENDPOINT: url(),
  });
};

export default validateEnv;
