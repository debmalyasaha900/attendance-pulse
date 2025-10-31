-- 002_seed.sql (example)
INSERT INTO users (id, email, name, role) VALUES
  (gen_random_uuid(), 'prof.john@example.edu', 'Prof John', 'faculty'),
  (gen_random_uuid(), 'alice.student@example.edu', 'Alice Student', 'student');

-- You can add students / faculty linking to those users by selecting the inserted user ids
