const baseUrl = "https://5dce9e0c75f9360014c25ffc.mockapi.io/api/";
export function getListProduct() {
  return axios({
    method: "GET",
    url: `${baseUrl}/sanPham`,
  });
}
export function createProduct(product) {
  return axios({
    method: "POST",
    url: `${baseUrl}/sanPham`,
    data: product,
  });
}
export function deleteProduct(id) {
  return axios({
    method: "DELETE",
    url: `${baseUrl}/sanPham/${id}`,
  });
}
