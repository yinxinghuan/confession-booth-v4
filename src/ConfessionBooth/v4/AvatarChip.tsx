import type { UserProfile } from './useCurrentUser';

interface Props {
  user: UserProfile | null;
  /** size variant */
  size?: 'sm' | 'md' | 'lg';
  /** optional click handler to open the user's profile via Aigram bridge */
  onClick?: () => void;
  className?: string;
}

const INITIALS_BG = ['#ff4d8e', '#ff7a4a', '#3ed9b9', '#a888ff', '#ffd24a', '#ff9a3c'];
function bgFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return INITIALS_BG[h % INITIALS_BG.length];
}

export default function AvatarChip({ user, size = 'md', onClick, className }: Props) {
  if (!user) return null;
  const initial = user.name.trim().charAt(0).toUpperCase() || '?';
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined as any}
      className={`cb4-avatar cb4-avatar--${size} ${onClick ? 'cb4-avatar--btn' : ''} ${className ?? ''}`}
      onPointerDown={onClick ? (e: any) => { e.preventDefault(); onClick(); } : undefined}
    >
      <span className="cb4-avatar__pic" style={{ background: bgFor(user.userId) }}>
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <span className="cb4-avatar__initial">{initial}</span>}
      </span>
      <span className="cb4-avatar__name">{user.name}</span>
    </Tag>
  );
}
