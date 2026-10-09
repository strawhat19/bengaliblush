import StatusCell from '../status-cell/status-cell';
import type { User } from '@/shared/models/users/User';

const OwnerUserRow = ({ user }: { user: User }) => (
  <tr id={`bb-owner-user-${user.id}`} className={`bb-owner-user-row`}>
    <td id={`bb-owner-user-number-${user.id}`} className={`bb-owner-user-number`}>{user.number}</td>
    <td id={`bb-owner-user-name-${user.id}`} className={`bb-owner-user-name`}>{user.name}</td>
    <td id={`bb-owner-user-email-${user.id}`} className={`bb-owner-user-email`}>{user.email}</td>
    <td id={`bb-owner-user-role-${user.id}`} className={`bb-owner-user-role`}><StatusCell id={`bb-owner-user-${user.id}`} status={user.role} /></td>
    <td id={`bb-owner-user-created-${user.id}`} className={`bb-owner-user-created`}>{new Date(user.created_at).toLocaleDateString()}</td>
  </tr>
);

export default OwnerUserRow;
