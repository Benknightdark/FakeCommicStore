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
  // try {
  //   if (!req.headers.cookie) {
  //     res.status(403).json({ message: "(1) Fuck off!!! You are not allowed to use this api!!!" })
  //   } else {
  //     const reqCookies = req.cookies // raw cookie string, possibly multiple cookies
  //     if (!reqCookies) {
  //       res.status(403).json({ message: "(2) Fuck off!!! You are not allowed to use this api!!!" })
  //       return 
  //     } else {

  //       const secret = process.env.NEXTAUTH_RANDOM_KEY_SECRECT
  //       const [csrfToken, csrfTokenHash] = reqCookies['next-auth.csrf-token'].split("|")
  //       const expectedCsrfTokenHash = createHash("sha256")
  //         .update(`${csrfToken}${secret}`)
  //         .digest("hex")
  //       console.log(reqCookies['next-auth.csrf-token'])
  //       console.log(csrfTokenHash)
  //       console.log(expectedCsrfTokenHash)
  //       if (csrfTokenHash !== expectedCsrfTokenHash) {
  //         res.status(403).json({ message: "(3) Fuck off!!! You are not allowed to use this api!!!" })
  //         return 
  //       }
  //     }
  //   }
  // } catch (err) {
  //   res.status(403).json({ message: "(4) Fuck off!!! You are not allowed to use this api!!!" })
  //   return
  // }
  // return
  let nextCsrToken = req.cookies['next-auth.csrf-token'] !== undefined ? req.cookies['next-auth.csrf-token'].split('|')[0] : ""
  let headerCsrfToken = req.headers['x-csrf-token'] === '' ? nextCsrToken : req.headers['x-csrf-token'];
  // console.log(`FROM HEADR=> ${headerCsrfToken}`)
  const currentServerCsrToken = await getCsrfToken({ req })
  console.log(currentServerCsrToken)
  if ((headerCsrfToken !== currentServerCsrToken)) {//headerCsrfToken
    res.status(403).json({ message: "Fuck off!!! You are not allowed to use this api!!!" })
    return;
  }
  console.log('--------------------------')

}