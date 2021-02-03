-- all categories
SELECT *
FROM categories;

-- all categories has offer
SELECT id, name
FROM categories
  JOIN offer_categories ON id = category_id
  GROUP BY id;

-- all categories with offer count
SELECT
  id,
  name,
  COUNT(offer_id)
FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id;

-- select last offers
SELECT offers.*,
  COUNT(comments.id) as comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON categories.id = offer_categories.category_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.created_at DESC;

-- select offer id = 1
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON categories.id = offer_categories.category_id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id;

-- select 5 last comments
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON users.id = comments.user_id
  ORDER BY comments.created_at DESC
  LIMIT 5;

-- select offer's comment
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON users.id = comments.user_id
WHERE comments.offer_id = 1
  ORDER BY comments.created_at DESC;

-- select 2 offers with type OFFER
SELECT * FROM offers
WHERE type = 'OFFER'
  LIMIT 2;

-- update title offer id = 1
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1;
