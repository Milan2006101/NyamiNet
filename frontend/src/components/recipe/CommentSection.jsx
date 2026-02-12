import { useState, useEffect } from 'react';
import { getUser, isAuthenticated } from '../../utils/auth';
import './styles/comments.css';

const API_BASE_URL = 'http://localhost:3001';

export default function CommentSection({ posztId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const user = getUser();

    useEffect(() => {
        if (posztId) {
            fetchComments();
        }
    }, [posztId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/komment/${posztId}`);
            const data = await response.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated()) {
            alert('Kommenteléshez be kell jelentkezned!');
            return;
        }

        if (!newComment.trim()) {
            alert('A komment nem lehet üres!');
            return;
        }

        if (newComment.length > 250) {
            alert('A komment maximum 250 karakter lehet!');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/komment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    felhasznalo_id: user.felhasznalo_id,
                    poszt_id: posztId,
                    komment_tartalom: newComment
                })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(); // Refresh comments
            } else {
                const error = await response.json();
                alert(error.uzenet || 'Hiba történt a komment küldésekor');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Hiba történt a komment küldésekor');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day}. ${hours}:${minutes}`;
    };

    return (
        <div className="comment-section">
            <h2 className="comment-section-title">Hozzászólások ({comments.length})</h2>
            
            {/* Comment form */}
            {isAuthenticated() ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        className="comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Írj egy hozzászólást... (max 250 karakter)"
                        maxLength={250}
                        rows={3}
                    />
                    <div className="comment-form-footer">
                        <span className="comment-char-count">
                            {newComment.length}/250
                        </span>
                        <button 
                            type="submit" 
                            className="comment-submit-btn"
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? 'Küldés...' : 'Hozzászólás'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="comment-login-prompt">
                    Jelentkezz be a hozzászóláshoz!
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="comments-loading">Hozzászólások betöltése...</div>
            ) : comments.length === 0 ? (
                <div className="comments-empty">Még nincs hozzászólás. Légy te az első!</div>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.komment_id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">{comment.felhasznalo_nev}</span>
                                <span className="comment-date">{formatDate(comment.komment_datum)}</span>
                            </div>
                            <div className="comment-content">{comment.komment_tartalom}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
