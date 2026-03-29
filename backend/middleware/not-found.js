const notFound = async (req, res) =>
  res.status(404).send("route not found");

export default notFound;
