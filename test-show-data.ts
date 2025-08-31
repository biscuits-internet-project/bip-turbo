import { dbClient } from "@bip/core";

async function getShowData() {
  const shows = await dbClient.show.findMany({
    take: 3,
    orderBy: { date: 'desc' },
    include: {
      venue: true,
      tracks: {
        include: {
          song: true
        },
        orderBy: [
          { set: 'asc' },
          { position: 'asc' }
        ]
      }
    }
  });

  console.log('=== SAMPLE SHOW DATA ===');
  shows.forEach(show => {
    console.log('\n--- Show:', show.date, '---');
    console.log('Venue:', show.venue?.name || 'Unknown');
    console.log('Location:', show.venue?.city, show.venue?.state);
    console.log('Rating:', show.averageRating);
    console.log('Slug:', show.slug);
    
    // Group tracks by set
    const tracksBySet: Record<string, typeof show.tracks> = {};
    show.tracks.forEach(track => {
      if (!tracksBySet[track.set]) tracksBySet[track.set] = [];
      tracksBySet[track.set].push(track);
    });
    
    Object.entries(tracksBySet).forEach(([set, tracks]) => {
      console.log(`Set ${set}:`, tracks.map(t => {
        let song = t.song.title;
        if (t.segue && t.segue !== 'none') song += ' >';
        return song;
      }).join(' '));
    });
  });

  await dbClient.$disconnect();
}

getShowData().catch(console.error);