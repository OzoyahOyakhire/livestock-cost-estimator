import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api.js';

//class for conflict error
class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export default ConflictError
