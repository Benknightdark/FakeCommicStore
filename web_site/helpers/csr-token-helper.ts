import { NextApiRequest, NextApiResponse } from "next"
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
    res:NextApiResponse
  ) => {
    console.log('--------------------------')
    let nextCsrToken=req.cookies['next-auth.csrf-token']!==undefined?req.cookies['next-auth.csrf-token'].split('|')[0]:""
    console.log(`FROM NEXT=> ${nextCsrToken}`)
    let headerCsrfToken = req.headers['x-csrf-token']==='' ? nextCsrToken : req.headers['x-csrf-token'];    
    console.log(`FROM HEADR=> ${headerCsrfToken}`)
    const currentServerCsrToken = await getCsrfToken({ req })
    console.log(`FROM SERVER=> ${currentServerCsrToken}`)
    console.log(headerCsrfToken !== currentServerCsrToken)
    if ((headerCsrfToken !== currentServerCsrToken)) {
      res.status(403).json({ message: "Fuck off!!! You are not allowed to use this api!!!" })
      return;
    }
    console.log('--------------------------')
  }