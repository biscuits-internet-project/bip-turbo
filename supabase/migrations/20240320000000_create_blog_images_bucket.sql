-- Create the blog-images bucket
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true);

-- Allow public access to read files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload files"
on storage.objects for insert
with check (
  bucket_id = 'blog-images'
  and auth.role() = 'authenticated'
);

-- Allow users to update their own files
create policy "Users can update their own files"
on storage.objects for update
using (
  bucket_id = 'blog-images'
  and auth.uid() = owner
)
with check (
  bucket_id = 'blog-images'
  and auth.uid() = owner
);

-- Allow users to delete their own files
create policy "Users can delete their own files"
on storage.objects for delete
using (
  bucket_id = 'blog-images'
  and auth.uid() = owner
); 