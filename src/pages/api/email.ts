import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(302, 'mailto:agcrisbp@proton.me');
}