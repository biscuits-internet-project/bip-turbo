-- Update any track that has an average rating but no ratings_count to have its rating_count set
with rating_aggregates as (
  select
    rateable_id,
    avg(value) as average_rating,
    count(id) as ratings_count
  from ratings
  where
    rateable_type = 'Track'
  group by
    rateable_id
)
update tracks
set
average_rating = rating_aggregates.average_rating,
ratings_count = rating_aggregates.ratings_count,
updated_at = now()
from rating_aggregates
where
tracks.average_rating != 0 and tracks.ratings_count = 0
and rating_aggregates.rateable_id = tracks.id;

-- Reset a tracks average_rating to 0 if there are no corresponding ratings in the rating table. There were between 100-200 of these.
update tracks
set
average_rating = 0,
ratings_count = 0,
updated_at = now()
where
tracks.average_rating != 0
and not exists (select 1 from ratings where ratings.rateable_type = 'Track' and ratings.rateable_id = tracks.id);

-- Reset a shows average_rating to 0 if there are no corresponding ratings in the rating table. There was 1 instance of this.
update shows
set
average_rating = 0,
ratings_count = 0,
updated_at = now()
where
shows.average_rating != 0
and not exists (select 1 from ratings where ratings.rateable_type = 'Show' and ratings.rateable_id = shows.id);
