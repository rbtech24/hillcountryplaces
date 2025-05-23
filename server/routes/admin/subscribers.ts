import { Request, Response } from "express";
import { storage } from "../../storage";

/**
 * Get all newsletter subscribers
 * @param req Express request
 * @param res Express response
 */
export async function getAllSubscribers(req: Request, res: Response) {
  try {
    const subscribers = await storage.getAllSubscribers();
    res.json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
}

/**
 * Delete a subscriber by ID
 * @param req Express request
 * @param res Express response
 */
export async function deleteSubscriber(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await storage.removeSubscriber(parseInt(id, 10));
    
    if (result) {
      res.json({ success: true, message: "Subscriber removed successfully" });
    } else {
      res.status(404).json({ message: "Subscriber not found" });
    }
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
}