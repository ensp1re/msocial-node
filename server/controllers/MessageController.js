import { text } from "express";
import getPrismaInstance from "../utils/PrismaClient.js";

const prisma = getPrismaInstance();

export const RelationMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({
        message: "senderId and receiverId are required",
      });

    const senderExists = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    const receiverExists = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!senderExists || !receiverExists)
      return res.status(400).json({
        message: "sender or receiver not found",
      });

    const relationExists = await prisma.messageRelation.findFirst({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      include: {
        messages: true,
        sender: true,
        receiver: true,
      },
    });

    if (relationExists) {
      return res.status(200).json({
        data: relationExists,
      });
    } else {
      const newRelation = await prisma.messageRelation.create({
        data: {
          sender: {
            connect: { id: senderId },
          },
          receiver: {
            connect: { id: receiverId },
          },
        },
        include: {
          messages: true,
          sender: true,
          receiver: true,
        },
      });

      return res.status(201).json({
        data: newRelation,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getRelation = async (req, res) => {
  try {
    const { relationId } = req.query;

    if (!relationId)
      return res.status(400).json({
        message: "RelationId is required",
      });

    const relation = await prisma.messageRelation.findUnique({
      where: {
        id: relationId,
      },
      include: {
        messages: {
          select: {
            sender: true,
            receiver: true,
            text: true,
            createdAt: true,
          },
        },
        sender: true,
        receiver: true,
      },
    });

    // const messageIds = relation?.messages.map((message) => message.id);

    // await prisma.message.updateMany({
    //   where: {
    //     id: {
    //       in: messageIds,
    //     },
    //   },
    //   data: {
    //     isRead: true,
    //   },
    // });

    if (!relation)
      return res.status(400).json({
        message: "RelationMessage not found",
      });

    return res.status(200).json({
      data: relation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllRelation = async (req, res) => {
  try {
    const relation = await prisma.messageRelation.findMany({
      include: {
        messages: {
          select: {
            sender: true,
            receiver: true,
            isRead: true,
            text: true,
          },
        },
        sender: true,
        receiver: true,
      },
    });

    if (!relation)
      return res.status(400).json({
        message: "RelationMessage not found",
      });

    return res.status(200).json({
      data: relation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { relationId, senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text || !relationId)
      return res.status(400).json({
        message: "SenderId and Receiver or text are required",
      });

    const message = await prisma.message.create({
      data: {
        relation: {
          connect: { id: relationId },
        },
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        text: text,
      },
    });

    if (!message)
      return res.status(401).json({
        message: "Error while creating a message",
      });

    return res.status(201).json({
      message: "Sent",
      data: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
