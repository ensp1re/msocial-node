import CommenteEl from "../CommenteEl";
import CommentForm from "../Form/CommenForm";

const PostCommentSide = ({ post, user }) => {
  return (
    <div className="w-full flex flex-col border-t border-t-gray-200">
      <div className="w-full p-3 flex border-b border-b-gray-200 flex-row">
        <CommentForm postId={post?.id} avatarUrl={user?.profileImage} />
      </div>
      <div className="w-full flex flex-col-reverse">
        {post?.comments &&
          post?.comments.map((comment) => {
            return (
              <CommenteEl
                key={comment?.id}
                user={comment?.user}
                id={comment?.id}
                imageUrl={comment?.imageUrl}
                text={comment?.text}
                createdAt={comment?.createdAt}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PostCommentSide;
