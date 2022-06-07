import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // if (!process.env.BASIC_USERNAME) {
  //   console.log('basic 1')
  return NextResponse.next()
  // }
  // console.log('basic 2')
  // const basicAuth = req.headers.get('authorization')
  // console.log('basic 3')
  // if (basicAuth) {
  //   console.log('basic 4')
  //   const auth = basicAuth.split(' ')[1]
  //   const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  //   if (user === process.env.BASIC_USERNAME && pwd === process.env.BASIC_PASSWORD) {
  //     console.log('basic 5')
  //     return NextResponse.next()
  //   }
  // }
  // console.log('basic 6')
  // return new Response('Auth required', {
  //   status: 401,
  //   headers: {
  //     'WWW-Authenticate': 'Basic realm="Secure Area"',
  //   },
  // })
}
