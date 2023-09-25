async function getUserLastTrack(user) {
  const apiKey = "f366cdff626d6631ecb68fd5398e150c";
  const userName = "casfoust";
  const data = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&format=json&limit=1&nowplaying=true&extended=true`
  )
  return data;
}
