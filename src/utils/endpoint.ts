import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { go } from "./try-catch";
import includeReturns from "./include-returns";

const prisma = new PrismaClient();

const endpoint = (route: string, schemaName: keyof PrismaClient) => {
  const router = Router();
  const delegate = prisma[schemaName] as any;

  //Create
  router.post(`${route}`, async (req, res) => {
    const [err, item] = await go(delegate.create({ data: req.body }));

    if (err)
      return res
        .status(400)
        .json({ error: "Failed to create item", details: err.message });
    res.status(201).json(item);
  });

  // READ all
  router.get(`${route}`, async (_req, res) => {
    const [err, items] = await go(delegate.findMany({ include: includeReturns(schemaName) }));

    if (err)
      return res
        .status(500)
        .json({ error: "Failed to fetch items", details: err.message });
    res.json(items);
  });

  // READ by ID
  router.get(`${route}/:id`, async (req, res) => {
    const { id } = req.params;
    const [err, item] = await go(delegate.findUnique({ where: { id } }));

    if (err)
      return res
        .status(500)
        .json({ error: "Failed to fetch item", details: err.message });
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
  });

  // UPDATE (PUT = full update)
  router.put(`${route}/:id`, async (req, res) => {
    const { id } = req.params;
    const [err, item] = await go(
      delegate.update({ where: { id }, data: req.body })
    );

    if (err)
      return res
        .status(404)
        .json({
          error: "Item not found or invalid data",
          details: err.message,
        });
    res.json(item);
  });

  // PATCH (partial update)
  router.patch(`${route}/:id`, async (req, res) => {
    const { id } = req.params;
    const [err, item] = await go(
      delegate.update({ where: { id }, data: req.body })
    );

    if (err)
      return res
        .status(404)
        .json({
          error: "Item not found or invalid data",
          details: err.message,
        });
    res.json(item);
  });

  // DELETE
  router.delete(`${route}/:id`, async (req, res) => {
    const { id } = req.params;
    const [err] = await go(delegate.delete({ where: { id } }));

    if (err)
      return res
        .status(404)
        .json({ error: "Item not found", details: err.message });
    res.json({ message: "Deleted" });
  });

  return router;
};

export default endpoint;
