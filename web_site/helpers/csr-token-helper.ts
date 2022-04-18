import { NextApiRequest, NextApiResponse } from "next"
import { getCsrfToken } from "next-auth/react";

export const csrTokenCheck = async (
    req: NextApiRequest,
    res:NextApiResponse
  ) => {
    console.log('--------------------------')
    let headerCsrfToken = req.headers['x-csrf-token'];
    console.log(`FROM HEADR=> ${headerCsrfToken}`)
    const currentServerCsrToken = await getCsrfToken({ req })
    console.log(`FROM SERVER=> ${currentServerCsrToken}`)
    if (headerCsrfToken !== currentServerCsrToken) {
      res.status(403).json({ message: "Fuck off!!! You are not allowed to use this api!!!" })
      return;
    }
    console.log('--------------------------')
  }