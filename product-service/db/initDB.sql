CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table products (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text,
	price int DEFAULT 0,
	image text
);

create table stocks (
 	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
 	product_id uuid,
 	count int DEFAULT 0,
	foreign key ("product_id") references "products" ("id")
);


insert into products (title, description, price, image) values
	('Nokia 3310', 'Отличное состояние, можно колоть орехи', 5549, 'https://2.downloader.disk.yandex.ru/preview/e51fa8c148ab0292761696e50c54d90674766f8bce2a640cbcc980f6868055ea/inf/TYhmb_ikZ9GSWEKYKNj1t1HRxtw7i64jJbi1SR_bKrIMo4OW78D_qf09AyfpexVaVSGPYq4qWxGAShhhld4z6w%3D%3D?uid=135824454&filename=s1200.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=135824454&tknv=v2&size=1903x937'),
	('Pink Virtual Pet Tamagotchi', 'Вырастите своего любимого питомца или кровожадного монстра', 8690, 'https://4.downloader.disk.yandex.ru/preview/50d34d7f343108518992bc66e14511a25de299dd2028ff0317acd54d3f1aa6b2/inf/3aBjI8-ipUrr2-m4PxqXBZ0eXRlfdWM3P3MOSO_mMJjqWuQ5_jcLaPG6OcJvf4C1lPqIAuI6z1N2Ik1JTsXYDw%3D%3D?uid=135824454&filename=%24_57.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=135824454&tknv=v2&size=1903x880'),
	('Sony Play Station 1', 'Первая культовая приставка от Sony', 4990, 'https://4.downloader.disk.yandex.ru/preview/8acc8fc54cdf7dfce830007e9e8665a39a38a1324d591698e3c7c5c5caf25d51/inf/WmpzgmfBarareC6Dfa2ivwOe2dISwCQpvmt_pN3DBTUEacf8Nlu_qFMzmoq_h_UBm6rjlzR7wrwdKG7a3cfWhw%3D%3D?uid=135824454&filename=download.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=135824454&tknv=v2&size=1903x937'),
	('Пингвины Kinder Surprise', 'Коллекция игрушек пингвинов из Kinder Surprise из 90х', 2590, 'https://4.downloader.disk.yandex.ru/preview/c93212801b03c1010a1e98ff13bc8c76d72b34043ed2c2cf53e1cf0ceff55b53/inf/jlay6NM9ceqj9WaIOlou3p0eXRlfdWM3P3MOSO_mMJjfLqD6bKUN2eVJ2T3o7-8o53TbiHjYVLhYeR_mw1iZmw%3D%3D?uid=135824454&filename=kinder-90kh-staraya-seriya-3-14804614.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=135824454&tknv=v2&size=1903x937'),
	('Модель Ваз 2101 1:43', 'Советская модель автомобиля Ваз 2101', 2590, 'https://2.downloader.disk.yandex.ru/preview/0e38b7b39da052b409ad4ca4245c78309463c1b4bed5ef96a7ebcccc244a6cfc/inf/UWXoH3yDuIEUGPfz3Q-z9hkHUVYlNIF5ILH02Yiw7h0PEkiR_Ksmu84S5QFiNU0T4vUjq32yabZkvNnFqgJv7A%3D%3D?uid=135824454&filename=b1a5fe4s-960.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=135824454&tknv=v2&size=1903x937')
	

-- insert into stocks (product_id, count) values
-- 	('733b1ba6-34b4-4443-9d8d-33f34c8c1ba5', '2'),
--  ('9963be08-3203-42de-b25d-c6227dc17e4f', '3'),
-- 	('ca10396a-1a64-4498-9474-f10d0df84af6', '1'),
-- 	('d31ca4db-503b-4c41-806e-44eaf6d25bb7', '1'),
-- 	('d8d7453b-a165-4816-bab2-25b6d4267c3b', '5')