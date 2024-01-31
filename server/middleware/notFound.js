export default function notFoundMiddleWare(req, res) {
  res
    .status(404)
    .send("There is 404 Route not define or you enter incorrect route");
}
