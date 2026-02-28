import { Response } from "express";

interface IMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
}

const sendResponse = <T>(res: Response, payload: IResponseData<T>): void => {
  const { statusCode, success, message, data, meta } = payload;

  res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    meta,
  });
};

export default sendResponse;
