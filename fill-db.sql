-- Add users
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('alexbyriy1@test.localhost', '5f4dcc3b5aa765d61d8327deb882cf99', 'Александр', 'Бурый', 'avatar03.jpg'),
('hack2020@test.localhost', '5f4dcc3b5aa765d61d8327deb882cf99', 'Анатолий', 'Хакимов', 'avatar04.jpg');

-- Add categories
INSERT INTO categories
("Животные"),
("Дача, сад и огород"),
("Досуг и развлечения"),
("Разное");

-- Add offers
ALTER TABLE offers DISABLE TRIGGER ALL;

INSERT INTO offers(title, description, sum, type, picture, user_id) VALUES
('Щенок в добрые руки', 'Отдам в связи с переездом. Отрываю от сердца.', 0, 'SALE', 'item14.jpg', 1),
('Куплю детские санки', 'В отличном состоянии без дефектов', 'OFFER', 2000, 'item01.jpg', 2),
('Куплю породистого кота', 'Полный комплект', 'OFFER', 15000, 'item07.jpg', 2),
('Продам диван и столик комплект', 'При покупке с меня бесплатная доставка в черте города', 'SALE', 1000, 'item06.jpg', 1),
('Продам отличную подборку фильмов на VHS.', 'Не помню уже сколько лет лежит просто без дела', 'SALE', 2000, 'item10.jpg', 1);

ALTER TABLE offers ENABLE TRIGGER ALL;

-- Add offer categories
ALTER TABLE offer_categories DISABLE TRIGGER ALL;

INSERT INTO offer_categories(offer_id, category_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 1),
(4, 2),
(5, 2);
(5, 4);

ALTER TABLE offer_categories ENABLE TRIGGER ALL;

-- Add comments
ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
('Держать негде', 2, 1);
('Отдаю в связи с переездом', 1, 1);
('Оплата наличными или перевод на карту?', 1, 2),
('Продай санки', 2, 2),
('Купи щенка', 1, 3),
('Неплохо, но дорого', 2, 3),
('С чем связана продажа? Почему так дешёво?', 2, 4),
('Лежит просто без дела', 1, 4),
('А где брать видак?', 2, 5),
('В магазине', 1, 5);

ALTER TABLE comments ENABLE TRIGGER ALL;
