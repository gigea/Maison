import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import './WishlistButton.css';

export default function WishlistButton({ product, className = '' }) {
  const { toggle, has } = useWishlist();
  const toast = useToast();
  const liked = has(product._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast.show(liked ? 'Removed from wishlist' : 'Added to wishlist ♥', liked ? 'info' : 'success');
  };

  return (
    <button className={`wishlist-btn ${liked ? 'liked' : ''} ${className}`} onClick={handleClick} title={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}
