import { Request, Response, NextFunction } from "express";

const map: { [key: string]: number } = {};

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestLimit = 5;
  const minute = 1;
  const ip = req.ip;

  const ipExists = (ip: string | undefined) =>
    Object.keys(map).includes(ip as string);
  const setNewIP = (ip: string | undefined) => (map[ip as string] = 1);
  const getReqNumById = (ip: string | undefined) => map[ip as string] || 0;
  const deleteIP = (ip: string | undefined) => delete map[ip as string];
  const incrementIPHit = (ip: string | undefined) => {
    map[ip as string] = (map[ip as string] || 0) + 1;
  };

  if (ipExists(ip)) {
    const requests = getReqNumById(ip);

    if (requests >= requestLimit) {
      return res.status(429).json({ message: "Too many requests" });
    }

    incrementIPHit(ip);
  } else {
    setNewIP(ip);

    setTimeout(() => deleteIP(ip), minute * 60 * 1000);
  }

  next();
};
