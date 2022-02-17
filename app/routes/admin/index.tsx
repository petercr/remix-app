import { Link } from "remix";

export default function AdminIndex() {
  return (
    <ul>
      <ol> <Link to="new">Create a New Post</Link></ol>

      <ol><Link to="edit">Edit Post</Link> </ol>
    </ul>
  );
}