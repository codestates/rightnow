import express, { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  sendData?: any;
}

export { CustomRequest };
