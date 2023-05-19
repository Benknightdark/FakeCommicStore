import { NextApiRequest, NextApiResponse } from "next"
import { createHash } from 'crypto';
import { getCsrfToken } from "next-auth/react";
/**
 * 
 * CSRToken驗證
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @return {*} 
 */
export const csrTokenCheck = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let nextCsrToken = req.cookies['next-auth.csrf-token'] !== undefined ? req.cookies['next-auth.csrf-token'].split('|')[0] : ""
  let headerCsrfToken = req.headers['x-csrf-token'] === '' ? nextCsrToken : req.headers['x-csrf-token'];
  const currentServerCsrToken = await getCsrfToken({ req })
  if ((headerCsrfToken !== currentServerCsrToken)) {//headerCsrfToken
    res.status(403).json({ message: "Fuck off!!! You are not allowed to use this api!!!" })
    return;
  }
  console.log('--------------------------')

}