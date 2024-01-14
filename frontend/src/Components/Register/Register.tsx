export default function Register() {
  return (
    <div>
      Register
      <a
        href={`${import.meta.env.VITE_DISCORD_URL}/authorize?client_id=${import.meta.env.VITE_DISCORD_UID}&response_type=code&redirect_uri=${
          import.meta.env.VITE_DISCORD_REDIRECT
        }&scope=identify`}
      >
        log with discord
      </a>
      <a href={`${import.meta.env.VITE_FT_URL}/authorize?client_id=${import.meta.env.VITE_FT_UID}&redirect_uri=${import.meta.env.VITE_FT_REDIRECT}&response_type=code`}> log with 42</a>
      <a href={`${import.meta.env.VITE_GITHUB_URL}/authorize?client_id=${import.meta.env.VITE_GITHUB_UID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT}&response_type=code`}>
        {" "}
        log with github
      </a>
      {/* <button onClick={auth42}> LOG with 0auth2 </button> */}
    </div>
  );
}
