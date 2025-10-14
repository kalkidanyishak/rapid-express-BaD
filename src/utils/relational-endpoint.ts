import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { go } from "./try-catch";

const prisma = new PrismaClient();

const relationalEndpoint = (
  apiRoute: string,
  filteredBy: string,
  route: string,
  prismaSchemaName: keyof PrismaClient
) => {
  const router = Router();
  const delegate = prisma[prismaSchemaName] as any;

  // READ all products in category
  router.get(`${apiRoute}/:id${route}`, async (req, res) => {
    const { id } = req.params;

    const [err, products] = await go(
      delegate.findMany({
        where: { [filteredBy]: id },
        include: { variants: true, manufacturer: true, unitOfMeasure: true },
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    res.json(products);
  });

  // READ single product in category
  router.get(`${apiRoute}/:id${route}/:objetId`, async (req, res) => {
    const { id, objetId } = req.params;

    const [err, product] = await go(
      delegate.findFirst({
        where: { id: objetId, [filteredBy]: id },
        include: { variants: true, manufacturer: true, unitOfMeasure: true },
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch product" });
    }

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  });

  // CREATE product in category
  router.post(`${apiRoute}/:id${route}`, async (req, res) => {
    const { id } = req.params;
    const { name, manufacturerId, unitId } = req.body;

    const [err, newProduct] = await go(
      delegate.create({
        data: { name, [filteredBy]: id, manufacturerId, unitId },
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create product" });
    }

    res.status(201).json(newProduct);
  });

  // UPDATE product in category
  router.put(`${apiRoute}/:id${route}/:objetId`, async (req, res) => {
    const { id, objetId } = req.params;
    const { name, manufacturerId, unitId } = req.body;

    const [err, updated] = await go(
      delegate.updateMany({
        where: { id: objetId, [filteredBy]: id },
        data: { name, manufacturerId, unitId },
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update product" });
    }

    if ((updated as any).count === 0) {
      return res
        .status(404)
        .json({ error: "Product not found in this category" });
    }

    res.json({ message: "Product updated successfully", data:updated });
  });

  // DELETE product in category
  router.delete(`${apiRoute}/:id${route}/:objetId`, async (req, res) => {
    const { id, objetId } = req.params;

    const [err, deleted] = await go(
      delegate.deleteMany({
        where: { id: objetId, [filteredBy]: id },
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    if ((deleted as any).count === 0) {
      return res
        .status(404)
        .json({ error: "Product not found in this category" });
    }

    res.json({ message: "Product deleted successfully" });
  });


  router.patch(`${apiRoute}/:id${route}/:objetId`, async (req, res) => {
    const { id, objetId } = req.params;
    const data = req.body;

    // Prevent filteredBy or ID from being updated accidentally
    delete data[filteredBy];
    delete data.id;

    // If no data remains after cleanup, nothing to update
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const [err, updated] = await go(
      delegate.updateMany({
        where: { id: objetId, [filteredBy]: id },
        data,
      })
    );

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update product" });
    }

    const count = (updated as any)?.count || 0;

    if (count === 0) {
      return res
        .status(404)
        .json({ error: "Product not found in this category" });
    }

    res.json({
      message: "Product updated successfully",
      count,
      data: updated,
    });
  });

  return router;
};
export default relationalEndpoint;
