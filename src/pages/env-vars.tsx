function EnvVars({ foo, username, password, gtm, one, two, three }: any) {
  return (
    <div>
      <p>env vars</p>
      <p>{username}</p>
      <p>{password}</p>
      <p>{gtm}</p>
      <p>{one}</p>
      <p>{two}</p>
      <p>{three}</p>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      username: String(process.env.BASIC_USERNAME),
      password: String(process.env.BASIC_PASSWORD),
      gtm: String(process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID),
      one: String(process.env.ONE),
      two: String(process.env.TWO),
      three: String(process.env.THREE),
    },
  }
}

export default EnvVars
