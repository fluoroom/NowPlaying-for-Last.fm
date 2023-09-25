import Image from 'next/image'

export default async function Home() {
  const apiKey ="f366cdff626d6631ecb68fd5398e150c"
  const userName = "casfoust"
  

  const data = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&format=json&limit=4&nowplaying=true&extended=true`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('error');
      })

    const track = data.recenttracks.track[0];
/*
    if (!track['@attr'].nowplaying) {
        console.log("not playing");
    }else{
      console.log("playing")
      console.log(track)
    }*/

  return (


  )
  
}
