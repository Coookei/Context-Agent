import cors from 'cors';

const WHITELISTED_ORIGINS =
  process.env.WHITELISTED_ORIGINS?.split(',')
    .map((u) => u.replace(/\/$/, '').trim())
    .filter(Boolean) ?? [];

export const BLOCKED_ORIGINS_MESSAGE = 'Request from disallowed origin';

export default cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non origin requests (same origin. postman etc.)
    if (WHITELISTED_ORIGINS.includes(origin)) {
      // allow requests from whitelisted origins. otherwise block.
      callback(null, true);
    } else {
      callback(new Error(BLOCKED_ORIGINS_MESSAGE));
    }
  },
  methods: ['GET', 'POST'],
});
