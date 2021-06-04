--Список всех категорий
SELECT * FROM categories

--Список непустых категорий
SELECT id, name FROM categories
  JOIN post_categories
  ON id = category_id
  GROUP BY id

--Категории с количеством публикаций
SELECT id, name, count(post_id) FROM categories
  LEFT JOIN post_categories
  ON id = category_id
  GROUP BY id

-- Список публикаций, сначала свежие
SELECT posts.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM posts
  JOIN post_categories ON posts.id = post_categories.post_id
  JOIN categories ON post_categories.category_id = categories.id
  LEFT JOIN comments ON comments.post_id = posts.id
  JOIN users ON users.id = posts.user_id
  GROUP BY posts.id, users.id
  ORDER BY posts.created_at DESC

-- Полная информация по публикации
SELECT posts.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM posts
  JOIN post_categories ON posts.id = post_categories.post_id
  JOIN categories ON post_categories.category_id = categories.id
  LEFT JOIN comments ON comments.post_id = posts.id
  JOIN users ON users.id = posts.user_id
WHERE posts.id = 1
  GROUP BY posts.id, users.id

-- Пять свежих комментариев
SELECT
  comments.id,
  comments.post_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Все комментарии к публикации
SELECT
  comments.id,
  comments.post_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.post_id = 1
  ORDER BY comments.created_at DESC

-- Обновить заголовок
UPDATE posts
SET title = 'Как я встретил Новый год'
WHERE id = 1
