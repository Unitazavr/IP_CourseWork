import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createComment, deleteComment, deletePost, getCommentsByPost, getPostById, updateComment } from '../api/api';

function PostDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (err) {
      setError('Ошибка загрузки поста');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getCommentsByPost(id, 1, 100);
      setComments(data.items || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      await deletePost(id);
      navigate('/posts');
    } catch (err) {
      alert('Ошибка удаления поста');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment({
        postId: parseInt(id),
        content: newComment,
      });
      setNewComment('');
      loadComments();
    } catch (err) {
      alert('Ошибка добавления комментария');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить комментарий?')) return;

    try {
      await deleteComment(commentId);
      loadComments();
    } catch (err) {
      alert('Ошибка удаления комментария');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateComment(commentId, {
        postId: parseInt(id),
        content: editContent,
      });
      setEditingComment(null);
      setEditContent('');
      loadComments();
    } catch (err) {
      alert('Ошибка обновления комментария');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error || 'Пост не найден'}</div>
        <Link to="/posts" className="btn btn-secondary">Назад к постам</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="card-title">{post.title}</h1>
            {user.id === post.authorId && (
              <div>
                <Link to={`/posts/edit/${post.id}`} className="btn btn-sm btn-warning me-2">
                  <i className="bi bi-pencil"></i> Редактировать
                </Link>
                <button onClick={handleDeletePost} className="btn btn-sm btn-danger">
                  <i className="bi bi-trash"></i> Удалить
                </button>
              </div>
            )}
          </div>

          <div className="mb-3">
            <span className="badge bg-secondary me-2">{post.categoryName}</span>
            <span className="text-muted">
              Автор: <Link to={`/users/${post.authorId}`}>{post.authorLogin}</Link>
            </span>
          </div>

          <div className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3>Комментарии ({comments.length})</h3>

        <form onSubmit={handleAddComment} className="mb-4">
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={2000}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-send me-2"></i>
            Отправить
          </button>
        </form>

        <div className="list-group">
          {comments.map(comment => (
            <div key={comment.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="mb-2">
                    <strong>
                      <Link to={`/users/${comment.userId}`}>{comment.userLogin}</Link>
                    </strong>
                    <small className="text-muted ms-2">
                      {new Date(comment.createdAt).toLocaleString('ru-RU')}
                    </small>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={2000}
                      />
                      <button 
                        onClick={() => handleUpdateComment(comment.id)} 
                        className="btn btn-sm btn-success me-2"
                      >
                        Сохранить
                      </button>
                      <button 
                        onClick={() => setEditingComment(null)} 
                        className="btn btn-sm btn-secondary"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                  )}
                </div>

                {user.id === comment.userId && editingComment !== comment.id && (
                  <div>
                    <button 
                      onClick={() => handleEditComment(comment)} 
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)} 
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="alert alert-info">Комментариев пока нет</div>
        )}
      </div>

      <div className="mt-4">
        <Link to="/posts" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Назад к постам
        </Link>
      </div>
    </div>
  );
}

export default PostDetailPage;