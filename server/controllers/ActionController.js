import getPrismaInstance from "../utils/PrismaClient.js";

const prisma = getPrismaInstance();

export const post = async (req, res) => {
  try {
    const { userId, text, imageUrl } = req.body;

    const post = await prisma.post.create({
      data: {
        text,
        imageUrl,
        user: {
          connect: { id: userId }, // Connect post to user using his id
        },
      },
    });

    if (!post)
      return res.status(401).json({
        error: "Error while creating a post",
      });

    return res.status(201).json({
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const getAllThePosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            nickname: true,
            avatarUrl: true,
            id: true,
          },
        },
        likes: true,
        reposts: true,
        bookmarks: true,
      },
    });

    if (!posts)
      return res.status(400).json({
        error: "Error while getting all the posts.",
      });

    return res.status(200).json({
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};

export const like = async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ error: "postId and userId are required" });
  }

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!post || !user) {
      return res.status(404).json({ error: "Post or user not found" });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return res.status(200).json({
        message: "Unliked",
        data: existingLike,
      });
    } else {
      const like = await prisma.like.create({
        data: {
          post: { connect: { id: postId } },
          user: { connect: { id: userId } },
        },
      });
      return res.status(201).json({
        message: "Liked",
        data: like,
      });
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const repost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId)
      return res.status(400).json({
        error: "userId and postId are required",
      });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!post || !user)
      return res.status(404).json({
        error: "Post or User not found",
      });

    const existingRepost = await prisma.repost.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingRepost) {
      try {
        const undoRepost = await prisma.repost.delete({
          where: {
            id: existingRepost.id,
          },
        });
        return res.status(200).json({
          message: "Undo Repost",
          data: undoRepost,
        });
      } catch (error) {
        return res.status(404).json({
          error: "Repost does not exist",
        });
      }
    } else {
      const repost = await prisma.repost.create({
        data: {
          user: {
            connect: { id: userId },
          },
          post: {
            connect: { id: postId },
          },
        },
      });

      if (!repost)
        return res.status(500).json({
          error: "Failed to repost",
        });

      return res.status(201).json({
        message: "Reposted",
        data: repost,
      });
    }
  } catch (error) {
    console.error("Error reposting:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const savePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId)
      return res.status(400).json({
        error: "userId and postId are required",
      });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!post || !user)
      return res.status(404).json({
        error: "Post or User not found",
      });

    const existingSave = await prisma.bookmark.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });

    if (existingSave) {
      try {
        const unsave = await prisma.bookmark.delete({
          where: {
            id: existingSave.id,
          },
        });
        return res.status(200).json({
          message: "Unsaved",
          data: unsave,
        });
      } catch (error) {
        return res.status(404).json({
          error: "Save does not exist",
        });
      }
    } else {
      const save = await prisma.bookmark.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      if (!save)
        return res.status(500).json({
          error: "Failed to save",
        });

      return res.status(201).json({
        message: "Saved",
        data: save,
      });
    }
  } catch (error) {
    console.error("Error saving:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const Comment = async (req, res) => {
  try {
    const { userId, postId, text, imageUrl } = req.body;

    if (!userId || !postId)
      return res.status(400).json({
        error: "userId and postId are required",
      });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!post || !user)
      return res.status(404).json({
        error: "Post or User not found",
      });

    const comment = await prisma.comment.create({
      data: {
        text,
        imageUrl,
        user: {
          connect: { id: userId },
        },
        post: {
          connect: { id: postId },
        },
      },
    });

    if (!comment)
      return res.status(401).json({
        error: "Error while creating a post",
      });

    return res.status(201).json({
      data: comment,
    });
  } catch (error) {
    console.log("Error while commenting the post");
    return res.status(500).json({ error: error });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { post_id } = req.query;

    if (!post_id) {
      return res.status(400).json({
        error: `PostId is required: ${post_id}`,
      });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: post_id,
      },
      include: {
        user: {
          select: {
            username: true,
            nickname: true,
            avatarUrl: true,
            id: true,
          },
        },
        likes: true,
        reposts: true,
        bookmarks: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
                nickname: true,
                avatarUrl: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Something went wrong!",
      });
    }

    return res.status(200).json({
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export const getAllThePostsByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username)
      return res.status(400).json({
        error: "Username is required",
      });

    const posts = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        posts: {
          include: {
            // Move "select" inside include for related posts
            user: {
              select: {
                username: true,
                nickname: true,
                avatarUrl: true,
                id: true,
              },
            },
            likes: true,
            reposts: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!posts) {
      return res.status(404).json({
        error: "Something went wrong",
      });
    }

    return res.status(200).json({
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
export const findUserByKeyText = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword)
      return res.status(400).json({
        error: "Keyword is required",
      });

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    });

    if (!users) {
      return res.status(404).json({
        error: "No users found",
      });
    }

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const findUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "No user found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(200).json({
        message: false,
      });
    }

    return res.status(200).json({
      message: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
export const follow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId)
      return res.status(400).json({
        message: "FollowerId and followingId are required",
      });

    // Проверяем, существуют ли пользователи с заданными идентификаторами
    const follower = await prisma.user.findUnique({
      where: {
        id: followerId,
      },
    });

    const following = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!following || !follower)
      return res.status(400).json({
        message: "FollowerId or followingId not found",
      });

    const isAlreadyFollowing = follower.following.includes(followingId);

    if (isAlreadyFollowing)
      return res.status(400).json({
        message: "You have already followed",
      });

    const follow_to_user = await prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        following: {
          set: [...follower.following, followingId],
        },
      },
    });

    const add_follower_to_user = await prisma.user.update({
      where: {
        id: followingId,
      },
      data: {
        followers: {
          set: [...following.followers, followerId],
        },
      },
    });

    if (!follow_to_user || !add_follower_to_user)
      return res.status(400).json({
        message: "Something went wrong",
      });

    return res.status(201).json({
      message: "Followed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const unfollow = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId)
      return res.status(400).json({
        message: "FollowerId and followingId are required",
      });

    const follower = await prisma.user.findUnique({
      where: {
        id: followerId,
      },
    });

    const following = await prisma.user.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!following || !follower)
      return res.status(400).json({
        message: "FollowerId or followingId not found",
      });

    const isFollowing = follower.following.includes(followingId);

    if (!isFollowing)
      return res.status(400).json({
        message: "You are not following this user",
      });

    const unfollowedFollower = await prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        following: {
          set: follower.following.filter((id) => id !== followingId),
        },
      },
    });
    const unfollowedFollowing = await prisma.user.update({
      where: {
        id: followingId,
      },
      data: {
        followers: {
          set: following.followers.filter((id) => id !== followerId),
        },
      },
    });

    if (!unfollowedFollower || !unfollowedFollowing)
      return res.status(400).json({
        message: "Something went wrong",
      });

    return res.status(201).json({
      message: "Unfollowed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const checkFollowing = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId)
      return res.status(400).json({
        message: "FollowerId and followingId are required",
      });

    const follower = await prisma.user.findUnique({
      where: {
        id: followerId,
      },
    });

    if (!follower)
      return res.status(400).json({
        message: "FollowerId not found",
      });

    const isFollowing = follower.following.includes(followingId);

    return res.status(200).json({
      message: isFollowing,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const Notification = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId)
      return res.status(400).json({
        message: "senderId and receiverId are required",
      });

    const notify = await prisma.notification.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        text,
      },
    });

    if (!notify)
      return res.status(400).json({
        message: "Something went wrong",
      });

    return res.status(201).json({
      data: notify,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllNotificationsById = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id)
      return res.status(400).json({
        message: "user_id is required",
      });

    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: user_id,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!notifications)
      return res.status(200).json({
        message: "Not found",
      });

    return res.status(201).json({
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { post_id } = req.body;

    if (!post_id)
      return res.status(400).json({
        message: "post_id is required",
      });

    const delete_post = await prisma.post.delete({
      where: {
        id: post_id,
      },
    });

    if (!delete_post) {
      return res.status(404).json({
        message: "Error",
      });
    }

    return res.status(201).json({
      message: "Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
