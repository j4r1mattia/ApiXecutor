import pino from 'pino';

const logger = pino({
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  messageKey: 'message',
  base: { pid: process.pid },
  redact: ['password', 'token'],
  transport: { target: 'pino-pretty' }
});

export default logger;
