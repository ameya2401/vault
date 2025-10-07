-- Create code_snippets table
create table code_snippets (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  code_content text not null,
  language text not null default 'javascript',
  category text not null default 'Uncategorized',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index code_snippets_created_at_idx on code_snippets (created_at);

-- Set up Row Level Security (RLS)
alter table code_snippets enable row level security;

-- Since we're not using authentication, we'll allow all operations
-- In a production environment, you would want to restrict these
create policy "Allow all operations"
  on code_snippets for all
  using ( true )
  with check ( true );

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
   NEW.updated_at = now();
   return NEW;
end;
$$ language 'plpgsql';

create trigger update_code_snippets_updated_at
  before update on code_snippets
  for each row
  execute procedure update_updated_at_column();