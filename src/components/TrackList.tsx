import Image from "next/image";

interface TrackListProps {
  tracks?: SpotifyApi.TrackObjectFull[];
  topArtists?: SpotifyApi.ArtistObjectFull[];
  playlists?: SpotifyApi.PlaylistObjectSimplified[];
  priority?: boolean;
}

export function TrackList({ tracks, topArtists, playlists, priority = false }: TrackListProps) {
  return (
    <div className="relative w-screen ml-[calc(-50vw)] left-1/2 mb-12 [mask-image:linear-gradient(to_right,#000_0%,#000_75%,#0000_100%)] lg:[mask-image:linear-gradient(to_right,#0000_0%,#000_25%,#000_75%,#0000_100%)] before:z-10">
      <div className="lg:px-[calc(50vw-400px)] md:px-[calc(50vw-350px)] px-8 lg:scroll-pl-[calc(50vw-400px)] md:scroll-pl-[calc(50vw-350px)] scroll-pl-8 grid grid-rows-2 grid-cols-[repeat(12,9rem)] md:grid-cols-[repeat(12,12rem)] lg:grid-cols-[repeat(12,14rem)] grid-flow-col gap-4 overflow-scroll no-scrollbar snap-x snap-mandatory">
        {tracks
          ? tracks.map(track => (
              <Track
                key={track.id}
                track={track}
                priority={priority}
              />
            ))
          : topArtists
          ? topArtists.map(artist => (
              <Artist
                key={artist.id}
                artist={artist}
              />
            ))
          : playlists?.map(playlist => (
              <Playlist
                key={playlist.id}
                playlist={playlist}
              />
            ))}
      </div>
    </div>
  );
}

interface TrackProps {
  track: SpotifyApi.TrackObjectFull;
  priority: boolean;
}

function Track({ track, priority }: TrackProps) {
  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative snap-start snap-always rounded-lg before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-0 before:transition before:duration-300 hover:before:opacity-50"
    >
      <div className="bg-slate-900 rounded-lg overflow-hidden aspect-square">
        <Image
          src={track.album.images[0].url}
          alt={track.name}
          width={512}
          height={512}
          priority={priority}
          className="rounded-lg transition duration-300 group-hover:scale-[1.02]"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className="z-20 absolute inset-2 md:inset-4 flex flex-col justify-end transition duration-300 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
        <p className="text-white font-bold text-xl md:text-2xl overflow-ellipsis leading-none md:leading-none mb-1">
          {track.name}
        </p>
        {track.artists.map(artist => (
          <p
            key={artist.id}
            className="text-white text-sm md:text-base leading-tight md:leading-tight opacity-80"
          >
            {artist.name}
          </p>
        ))}
      </div>
    </a>
  );
}

interface ArtistProps {
  artist: SpotifyApi.ArtistObjectFull;
}

function Artist({ artist }: ArtistProps) {
  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative snap-start snap-always rounded-lg before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-0 before:transition before:duration-300 hover:before:opacity-50"
    >
      <div className="bg-slate-900 rounded-lg overflow-hidden aspect-square">
        <Image
          src={artist.images[0]?.url}
          alt={artist.name}
          width={512}
          height={512}
          priority={true}
          className="rounded-lg transition duration-300 group-hover:scale-[1.02]"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <div className="z-20 absolute inset-2 md:inset-4 flex flex-col justify-end transition duration-300 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
        <p className="text-white text-sm md:text-base leading-tight md:leading-tight opacity-80">
          {artist.name}
        </p>
      </div>
    </a>
  );
}

interface PlaylistProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

function Playlist({ playlist }: PlaylistProps) {
  return (
    <a
      href={playlist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative snap-start snap-always rounded-lg before:absolute before:inset-0 before:z-10 before:bg-black before:opacity-0 before:transition before:duration-300 hover:before:opacity-50"
    >
      <div className="bg-slate-900 rounded-lg overflow-hidden aspect-square">
  <Image
    src={playlist.images?.[0]?.url || '/default-image.jpg'} // Fallback to a default image if no images are available
    alt={playlist.name}
    width={512}
    height={512}
  />
</div>
      <div className="z-20 absolute inset-2 md:inset-4 flex flex-col justify-end transition duration-300 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100">
        <p className="text-white font-bold text-xl md:text-2xl overflow-ellipsis leading-none md:leading-none mb-1">
          {playlist.name}
        </p>
      </div>
    </a>
  );
}