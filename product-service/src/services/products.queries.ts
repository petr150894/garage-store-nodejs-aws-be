export const GET_PRODUCTS_QUERY = 
  `SELECT P.id, P.title, P.description, P.price, P.image, S.count
    FROM products AS P
    INNER JOIN stocks AS S
    ON P.Id = S.product_id;`;
export const GET_PRODUCT_BY_ID_QUERY = 
 `SELECT P.id, P.title, P.description, P.price, P.image, S.count
    FROM products AS P
    INNER JOIN stocks AS S
    ON P.Id = S.product_id
    WHERE P.id=$1;`;
export const INSERT_PRODUCT_QUERY = 
 `insert into products (title, description, price, image) values
    ($1, $2, $3, $4)
    returning id;`

export const INSERT_STOCK_RECORD_QUERY = 
 `insert into stocks (product_id, count) values
    ($1, $2);`