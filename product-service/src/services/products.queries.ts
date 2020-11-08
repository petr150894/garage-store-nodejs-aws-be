export const getProductsQuery = 
  `SELECT P.id, P.title, P.description, P.price, P.image, S.count
    FROM products AS P
    INNER JOIN stocks AS S
    ON P.Id = S.product_id;`;
export const getProductByIdQuery = 
 `SELECT P.id, P.title, P.description, P.price, P.image, S.count
    FROM products AS P
    INNER JOIN stocks AS S
    ON P.Id = S.product_id
    WHERE P.id=$1;`;